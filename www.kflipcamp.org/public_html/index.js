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



// Variables that hold listener counts and broadcast stream
let lastReportedShoutingFireListeners = 0;
let lastReportedKflipListeners = 0;
let broadcastingStream = null;



//
// updateKflipListenerCount(listeners) - emits the number of current listeners to any connected browser
//
function updateKflipListenerCount(listeners) {
    lastReportedKflipListeners = listeners;
    io.emit('listeners',
        {
            count: lastReportedKflipListeners
        });
}



const http = require('http');
var kflipstatus = {
    host: 'www.kflipcamp.org',
    path: '/status-json.xsl',
    port: 8000
};


function streamsAreDifferent(stream1, stream2) {
    if (stream1 && !stream2)
        return true;

    if (!stream1 && stream2)
        return true;

    return (stream1.listenurl !== stream2.listenurl);
}

//
// checkForSomethingNew(newIcecastStatsJson) - reads the results of www.fklipcamp.org/status-json.xsl and determines if the broadcasting stream or the song has changed
//
let icecastStatsParseError = false;
function checkForSomethingNew(newIcecastStatsJson) {

    try {
        if (newIcecastStatsJson.includes(': - ,')) {
            newIcecastStatsJson = newIcecastStatsJson.replace(': - ,', ': "-" ,');
        }

        var newIcecastStats = JSON.parse(newIcecastStatsJson);

        if (icecastStatsParseError) {
            console.log('Icecast stats parse error is gone.');
            icecastStatsParseError = false;
        }

        if (!newIcecastStats.icestats || !newIcecastStats.icestats.source)
            return;
    }
    catch (err) {
        if (icecastStatsParseError == false) {
            console.log('Exception in icecast stats - ' + err.message + ' with ' + newIcecastStatsJson);
            icecastStatsParseError = true;
        }

        return;
    }

    try {

        let sameOldSong = true;
        let newTitle = '';
        let listeners = 0;
        let streamIndex = 0;
        let firstStreamBroadcasting = null;

        // This index setting will work with the below while loop if newIcecastStats.icestats.source
        // is an array or a single object
        const sources = (newIcecastStats.icestats.source.length === undefined)
            ? 1
            : newIcecastStats.icestats.source.length;

        let newSource = (newIcecastStats.icestats.source.length === undefined) ? newIcecastStats.icestats.source : newIcecastStats.icestats.source[0];

        // Loops through the defined streams and chooses the first one with an audio_info object, which means someone is broadcasting to it
        while (streamIndex < sources) {

            if (newSource.audio_info) {
                firstStreamBroadcasting = newSource;
                break;
            }

            // If the icestats.source is an array, this will look at the next element
            ++streamIndex;
            if (streamIndex < sources) {
                newSource = newIcecastStats.icestats.source[streamIndex];
            }
        }

        if (firstStreamBroadcasting) {
            newTitle = firstStreamBroadcasting.title;
            listeners = firstStreamBroadcasting.listeners;
        }

        // streamAreDifferent returns true if either the stream has changed or the song has changed
        if (streamsAreDifferent(broadcastingStream, firstStreamBroadcasting)) {
            sameOldSong = false;

            if (!firstStreamBroadcasting) {
                // Oops - it looks like no stream is broadcasting at all! How?
                newTitle = 'Dead air';
                sameOldSong = false;
                listeners = 0;
                console.log('Stream has changed - We are off the air!');
            } else {
                sameOldSong = false;

                // TODO CONFIGURATION - these streams should be in a configuration file somewhere
                if (firstStreamBroadcasting.listenurl === 'http://www.kflipcamp.org:8000/kflip') {
                    console.log('Stream has changed - A live DJ is broadcasting');
                } else if (firstStreamBroadcasting.listenurl === 'http://www.kflipcamp.org:8000/kflip_auto') {
                    console.log('Stream has changed - Otto has the KFLIP stream');
                } else if (firstStreamBroadcasting.listenurl === 'http://www.kflipcamp.org:8000/shoutingfire') {
                    console.log('Stream has changed - KFLIP is broadcasting ShoutingFire');
                }
            }

            broadcastingStream = firstStreamBroadcasting;

        } else if (!broadcastingStream || (broadcastingStream.title !== newTitle)) {
            broadcastingStream.title  = newSource.title;
            sameOldSong = false;
        }

        // Go ahead and update the listencount while we are at it
        if (listeners !== lastReportedKflipListeners) {
            updateKflipListenerCount(listeners);
        }

        // If the streams are different, bail out - otherwise emit the new song information to the connected browsers
        if (sameOldSong) {
            return;
        }

        console.log('Now playing: ' + newTitle + ' (' + listeners + ') listeners');
        io.emit('nowplaying', { stream: broadcastingStream });

    } catch (err) {
        console.log('Exception in checkForSomethingNew - ' + err.message + ' with ' + newIcecastStatsJson);
    }
}

//
// getNowPlayingAsync() - queries www.fklipcamp.org/status-json.xsl and sends the results into checkForSomethingNew
//
async function getNowPlayingAsync() {

    try {
        var req = http.get(kflipstatus,
            function(res) {
                //console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));

                // Buffer the body entirely for processing as a whole.
                var bodyChunks = [];
                res.on('data',
                    function(chunk) {
                        // You can process streamed parts here...
                        bodyChunks.push(chunk);
                    }).on('end',
                    function() {
                        var body = Buffer.concat(bodyChunks);
                        checkForSomethingNew(body.toString());

                        //console.log('BODY: ' + body);
                    });
            });

        req.on('error',
            function(e) {
                console.log('Error calling GET kflipstatus - ' + e.message);
            });
    } catch (err) {
        console.log('Exception in getNowPlayingAsync - ' + err.message);
    }

}

//
// updateNowPlaying() - normal function calling asynchronous getNowPlayingAsync()
//
function updateNowPlaying() {
    (async () => {
        await getNowPlayingAsync();
    })();
}


//
// onShoutingFire() - returns true if the station is on shoutingfire
//
function onShoutingFire() {
    return (broadcastingStream &&
        broadcastingStream.listenurl === 'http://www.kflipcamp.org:8000/shoutingfire');
}

let shoutingFireListeners = 0;
const https = require('https');
const cheerio = require('cheerio');
var shoutingFireStatus = {

    host: 'shoutingfire-ice.streamguys1.com',
    path: '/status.xsl'
};

//
// checkShoutingFire() - calls shoutingfire-ice.streamguys1.com/status.xsl to find out what's playing and how many listeners they have
//
function checkShoutingFire() {

    try {

        if (onShoutingFire() === false) {
            return;
        }

        var req = https.get(shoutingFireStatus,
            function (res) {
                //console.log('STATUS: ' + res.statusCode);
                //console.log('HEADERS: ' + JSON.stringify(res.headers));

                // Buffer the body entirely for processing as a whole.
                var bodyChunks = [];
                res.on('data',
                    function (chunk) {
                        // You can process streamed parts here...
                        bodyChunks.push(chunk);
                    }).on('end',
                    function () {
                        var body = Buffer.concat(bodyChunks);

                        try {

                            //
                            // Icecast recommends you do NOT parse this, since it could change from version to verion. 
                            //   So if shoutingfire listeners or song played is broken, debug through this to find out why
                            //
                            const $ = cheerio.load(body);
                            let h3 = null;

                            $('h3').each(function(i, e) {
                                if ($(this).text().includes('/live')) {
                                    h3 = $(this);
                                    return false;
                                }
                                return true;
                            });

                            if (h3) {
                                const parents = h3.parentsUntil('.newscontent');
                                if (parents.length) {
                                    const divStreamHeader = parents[parents.length - 1];
                                    const infoTable = divStreamHeader.nextSibling;

                                    $('td', infoTable).each(function(i, e) {
                                        if ($(this).text().includes('Current Listeners')) {
                                            shoutingFireListeners = $(this.nextSibling).text();
                                            return false;
                                        }
                                        return true;
                                    });
                                }
                            }

                            shoutingFireListeners = parseInt(shoutingFireListeners);

                            if (lastReportedShoutingFireListeners !== shoutingFireListeners) {
                                lastReportedShoutingFireListeners = shoutingFireListeners;
                                io.emit('shoutingfire', { listeners: shoutingFireListeners });
                            }

                            //console.log('ShoutingFire has ' + shoutingFireListeners + ' listeners');

                        } catch (err) {
                            console.log('There was a problem finding ShoutingFire listener count - ' + err.message);
                        }
                    });
            });

        req.on('error',
            function (e) {
                console.log('ERROR: ' + e.message);
            });
    } catch (err) {
        console.log('Exception in checkShoutingFire - ' + err);
    }
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


//
// server.listen - launches the listen port for the website
//
server.listen(port, () => {
    events.Start(onScheduleChange);
    setInterval(updateNowPlaying, 5000);

    checkShoutingFire();
    setInterval(checkShoutingFire, 60000);
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
// POST /nowplaying - called by Otto (when using MIXX) or the MediaMonkey KFLIPJingleRotator.vb script
//
app.post('/nowplaying', function (req, res) {
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

        if (kflipShowString) {

            socket.emit('schedule',
                {
                    username: 'KFLIP',
                    message: kflipShowString
                });
        }

        if (broadcastingStream) {

            socket.emit('nowplaying', { stream: broadcastingStream });

            if (onShoutingFire()) {
                socket.emit('shoutingfire', { listeners: shoutingFireListeners });
            }

        }
    });
