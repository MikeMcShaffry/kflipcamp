//
// index.js - Entry point for the kflipcamp.org web site
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//   NOTE: COPYRIGHT will be assigned to KFLIPCAMP as soon as the legal entity is created! 
//
// The source code contained herein is open source under the MIT license, with the EXCEPTION of embedded passwords and authentication keys.


// Setup basic express server
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');

const path = require('path');
const server = require('http').createServer(app);

// Socket.io listens on port 3000 (or configured environment variable) for events like the song or DJ calendar changing
const io = require('socket.io')(server);
var port = process.env.PORT || 3000;

const config = require('./config.json').studio;

const events = require('./events.js');
const icecastInfo = require('./icecastinfo.js');
const otto = require('./otto.js');
const library = require('./library.js');
const lastfm = require('./lastfm.js');
const archive = require('./archive.js');
const twitter = require('./twitter.js');
const patreon = require('./patreon.js');

// Stores the last title information from icecast stats - it is in the form of artist - song - album
let streamInfo = null;

//
// updateKflipListenerCount(listeners) - emits the number of current listeners to any connected browser
//
let lastReportedKflipListeners = 0;
function updateKflipListenerCount(listeners) {
    lastReportedKflipListeners = listeners;
    io.emit('listeners',
        {
            count: lastReportedKflipListeners
        });
}


//
// onAlbumInfoChange - called by the lastfm.js module whenever the album info changes - it emits the new album info to all connected browsers
//
var albumInfo = null;
function onAlbumInfoChange(albumSummary, albumImage) {

    albumInfo = { summary: albumSummary, image: albumImage };
    io.emit('albuminfo',
        {
            username: 'KFLIP',
            message: albumInfo
        });
}



//
// onScheduleChange - called by the events.js module whenever the schedule cahnges - it emits the new schedule to all connected browsers
//
var kflipShowString = null;
function onScheduleChange(calendarId, eventList) {

    kflipShowString = JSON.stringify(eventList);
    io.emit('schedule',
        {
            username: 'KFLIP',
            calendarId: calendarId,
            message: kflipShowString
        });
}

function onStartEvent(event) {
    archive.OnStartEvent(event);
    twitter.OnStartEvent(event);
    otto.EngineeringLogEntry(`Recording just started for ${event.summary}`)
}

function onEndEvent(event) {
    archive.OnEndEvent(event);
    otto.EngineeringLogEntry(`Recording ended for ${event.summary}`)
}

function addToEngineeringLog(logMessage) {
    otto.EngineeringLogEntry(logMessage)
}



// onSomethingNewPlaying() - called by icecastinfo.js whenever a stream change happens or something new is playing
//
function onSomethingNewPlaying(newStreamInfo, listenerCount, streamChanged) {

    streamInfo = newStreamInfo;

    archive.AddToLog(streamInfo.title);

    console.log('INFO - Now playing [' + streamInfo.title + '] Listeners [' + listenerCount + ']');
    io.emit('nowplaying', { stream: streamInfo });

    if (otto.Enabled) {
        otto.UpdateNowPlaying(streamInfo.title, streamChanged);
    }

    if (lastfm.Enabled) {
        lastfm.UpdateNowPlaying(streamInfo.title);
    }
}

let shoutingFireListeners = 0;
function onShoutingFireUpdated(shoutingFireListenerCallback) {
    shoutingFireListeners = shoutingFireListenerCallback;
    io.emit('shoutingfire', { listeners: shoutingFireListeners });
}

let currentDj = '';
function onCurrentDjChanged(newDj) {
    currentDj = newDj;
    io.emit('newdj', currentDj);
}


let phoneDisplayed = false;
function onPhoneDisplayChanged(phoneOn) {
    phoneDisplayed = phoneOn;

    io.emit('phone', { displayed: phoneDisplayed, number: config.phone });
};

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

//
// server.listen - launches the listen port for the website
//
server.listen(port, async () => {

    try {

        await archive.Start(events.AddDetails);
        await otto.Start(onCurrentDjChanged, onPhoneDisplayChanged);
        
        let waitingLoops = 0;
        while (!otto.IsReady()) {
            await delay(1000);
            if (waitingLoops > 5) {
                console.log(`ERROR - Otto could not initialize`);
                break;
            }
            ++waitingLoops;
        } 
        
        currentDj = otto.CurrentDJ;
        events.Start(onScheduleChange, onStartEvent, onEndEvent, addToEngineeringLog);
        icecastInfo.Start(onSomethingNewPlaying, updateKflipListenerCount);
        icecastInfo.CheckShoutingFire(onShoutingFireUpdated);
        await library.Start();
        await lastfm.Start(onAlbumInfoChange);
        await twitter.Start(config.site_url, config.tz);
        console.log('INFO - server listening at port %d', port);
        addToEngineeringLog('INFO - KFLIP server has started');
    }
    catch (err) {
        console.log('CRITICAL ERROR - Exception in server.listen', err);
        process.exit();
    }
});

// Routing API calls for the web site - first the static routes that serve files and directories of files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

// Add a parser to manage POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: config.session_secret,
    resave: false,
    saveUninitialized: true
}))

patreon.ConfigureApp(app);


//
// GET /nowplaying/albumimage
//
app.get('/nowplaying/albumimage',
    async function(req, res) {
        res.set('Content-Type', 'text/html');
        res.end(lastfm.AlbumImage);
    });

//
// GET /nowplaying/albumsummary
//
app.get('/nowplaying/albumsummary',
    async function(req, res) {
        res.set('Content-Type', 'text/html');
        res.end(lastfm.AlbumSummary);
    });


//
// GET /nowplaying/title
//
app.get('/nowplaying/title',
    async function(req, res) {
        res.set('Content-Type', 'text/html');
        if (streamInfo && streamInfo.title) {
            res.end(streamInfo.title);
        }
        else {
            res.end();
        }
    });


//
// GET /search
//
app.get('/search', async function (req, res) {
    let results = [];
    try {
        if (req.body.by === 'artist') {
            var artist = req.body.artist; 
            results = await library.SearchByArtist(artist);
        }
    }
    catch (err) {
        console.log('ERROR - POST /search: ' + err.message);
    }

    res.end(JSON.stringify(results));
});


//
// GET /search
//
app.get('/archive/:start/:end', async function (req, res) {
    let results = [];
    try {
        if ( (moment(req.params.start, moment.ISO_8601).isValid() === false) ||
             (moment(req.params.end, moment.ISO_8601).isValid() === false) ) {
            res.status(400).send({message:'Invalid parameters'});         
        }
        results = await events.GetEventsByDate(req.params.start, req.params.end);
    }
    catch (err) {
        console.log('ERROR - GET /archive/:start/:end - ' + err.message);
    }

    res.end(JSON.stringify(results));
});

//
// GET /auth/patreon - called when someone clicks the "I'm a patreon person" button
//
app.get('/auth/patreon', patreon.passport.authenticate('patreon', {
    successReturnToOrRedirect: "/"
}));

//
// GET /auth/patreon/redirect - Patreon calls this redirect after a person attempts to auth via Patreon
app.get('/oauth/callback', patreon.passport.authenticate('patreon', {
    callback: true,
    successReturnToOrRedirect: '/',
    failureRedirect: '/'
}))

app.get('/auth/user', function(req, res){
    console.log('INFO - GET /auth/user');
    if(req.isAuthenticated()){
        console.log(`INFO - /auth/user sees ${req.user.name}`);
        res.status(200).json({ supporter: true, name: req.user.name, avatar: req.user.avatar});
    } else {
        console.log(`INFO - /auth/user sees an unauthenticated listener`);
        res.status(200).json({ supporter: false });
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    //res.render('error');
});


//
// io.on('connection') - A browser will initiate a connection to the web site to listen for events like the song or calendar changing
//
io.on('connection',
    (socket) => {

        // The moment they connect we will send them the kflip DJ schedule, and nowPlaying and listener information
        if (kflipShowString) {

            socket.emit('schedule',
                {
                    username: 'KFLIP',
                    message: kflipShowString
                });
        }

        if (albumInfo) {
            socket.emit('albuminfo',
                {
                    username: 'KFLIP',
                    message: albumInfo
                });
        }


        if (streamInfo) {
            socket.emit('nowplaying', { stream: streamInfo });
            socket.emit('listeners', { count: streamInfo.listeners });
        }

        if (shoutingFireListeners) {
            socket.emit('shoutingfire', { listeners: shoutingFireListeners });
        }

        socket.emit('newdj', currentDj);
        socket.emit('phone', { displayed: phoneDisplayed, number: config.phone });

    });


//
// Avoids the process shutting down due to an unhandled promise rejection or unhandled exceptions
//
process.on('unhandledRejection', error => {
    console.log('CRITICAL ERROR - unhandledRejection', error);
});


process.on('uncaughtException', error => {
    console.log('CRITICAL ERROR - unchaughtException ', error);
});




