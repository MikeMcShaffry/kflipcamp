//
// index.js - Entry point for the kflipcamp.org web site
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT licence, with the EXCEPTION of embedded passwords and authentication keys.


// Setup basic express server
var express = require('express');
var bodyParser = require("body-parser");
var app = express();

var path = require('path');
var server = require('http').createServer(app);

// Socket.io listens on port 3000 (or configured environment variable) for events like the song or DJ calendar changing
var io = require('.')(server);
var port = process.env.PORT || 3000;


var events = require('./events.js');
var icecastInfo = require('./icecastinfo.js');
var otto = require('./otto.js');


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
// onScheduleChange - called by the events.js module whenever the schedule cahnges - it emits the new schedule to all connected browsers
//
var kflipShowString = null;
function onScheduleChange(eventList) {

    kflipShowString = JSON.stringify(eventList);

    let keys = Object.keys(io.sockets.sockets);

    keys.forEach(function (key) {
        const connectedSocket = io.sockets.sockets[key];
        connectedSocket.emit('schedule',
            {
                username: 'KFLIP',
                message: kflipShowString
            });
    });
}


// onSomethingNewPlaying() - called by icecastinfo.js whenever a stream change happens or something new is playing
function onSomethingNewPlaying(streamInfo, listenerCount) {
    console.log('Now playing: ' + streamInfo.title + ' (' + listenerCount + ') listeners');
    io.emit('nowplaying', { stream: streamInfo });

    if (otto.Enabled) {
        otto.UpdateNowPlaying(streamInfo.title);
    }
}

function onShoutingFireUpdated(shoutingFireListeners) {
    io.emit('shoutingfire', { listeners: shoutingFireListeners });
}


//
// server.listen - launches the listen port for the website
//
server.listen(port, () => {
    events.Start(onScheduleChange);
    icecastInfo.Start(onSomethingNewPlaying, updateKflipListenerCount);
    icecastInfo.CheckShoutingFire(onShoutingFireUpdated);

    console.log('Server listening at port %d', port);
});

// Routing API calls for the web site - first the static routes that serve files and directories of files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/controllers', express.static(path.join(__dirname, 'public/controllers')));

// Add a parser to manage POST data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//
// POST /makerequest
//
app.post('/makerequest', function (req, res) {
    try {
        var song = req.body.song;
        var artist = req.body.artist;   
        console.log("Song = " + song + ", artist is " + artist);
    }
    catch (err) {
        console.log('Error detected in POST newsong: ' + err.message);
    }
    res.end("ok");
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

        var currentStream = icecastInfo.GetCurrentStream();
        if (currentStream) {
            socket.emit('nowplaying', { stream: currentStream });
            socket.emit('shoutingfire', { listeners: ShoutingFireListeners });
        }
    });
