//
// index.js - Entry point for the kflipcamp.org web site
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT license, with the EXCEPTION of embedded passwords and authentication keys.


// Setup basic express server
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

const path = require('path');
const server = require('http').createServer(app);

// Socket.io listens on port 3000 (or configured environment variable) for events like the song or DJ calendar changing
const io = require('.')(server);
var port = process.env.PORT || 3000;

const config = require('./config.json').studio;

const events = require('./events.js');
const icecastInfo = require('./icecastinfo.js');
const otto = require('./otto.js');
const library = require('./library.js');
const lastfm = require('./lastfm.js');
const archive = require('./archive.js');


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

    let keys = Object.keys(io.sockets.sockets);

    keys.forEach(function (key) {
        const connectedSocket = io.sockets.sockets[key];
        connectedSocket.emit('albuminfo',
            {
                username: 'KFLIP',
                message: albumInfo
            });
    });
}



//
// onScheduleChange - called by the events.js module whenever the schedule cahnges - it emits the new schedule to all connected browsers
//
var kflipShowString = null;
function onScheduleChange(calendarId, eventList) {

    kflipShowString = JSON.stringify(eventList);

    let keys = Object.keys(io.sockets.sockets);

    keys.forEach(function (key) {
        const connectedSocket = io.sockets.sockets[key];
        connectedSocket.emit('schedule',
            {
                username: 'KFLIP',
                calendarId: calendarId,
                message: kflipShowString
            });
    });
}


// onSomethingNewPlaying() - called by icecastinfo.js whenever a stream change happens or something new is playing
function onSomethingNewPlaying(newStreamInfo, listenerCount, streamChanged) {

    streamInfo = newStreamInfo;

    archive.AddToLog(streamInfo.title);

    console.log('Now playing: ' + streamInfo.title + ' (' + listenerCount + ') listeners');
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

//
// server.listen - launches the listen port for the website
//
server.listen(port, async () => {

    try {

        await archive.Start(events.AddDetails);
        otto.Start(onCurrentDjChanged, onPhoneDisplayChanged);
        currentDj = otto.CurrentDJ;
        events.Start(onScheduleChange, archive.OnStartEvent, archive.OnEndEvent);
        icecastInfo.Start(onSomethingNewPlaying, updateKflipListenerCount);
        icecastInfo.CheckShoutingFire(onShoutingFireUpdated);
        await library.Start();
        await lastfm.Start(onAlbumInfoChange);

        console.log('Server listening at port %d', port);
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
        console.log('Error detected in POST /search: ' + err.message);
    }

    res.end(JSON.stringify(results));
});


//
// GET /search
//
app.get('/archive/:year/:month', async function (req, res) {
    let results = [];
    try {
        // TODO validate parameters!
        results = await events.GetEventArchive(req.params.year, req.params.month);
    }
    catch (err) {
        console.log('Error detected in POST /search: ' + err.message);
    }

    res.end(JSON.stringify(results));
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
    console.log('unhandledRejection', error);
});


process.on('uncaughtException', error => {
    console.log('unchaughtException ', error);
});




