// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('.')(server);
var port = process.env.PORT || 3000;
var events = require('./events.js');

let kflipShows = null;
let kflipShowString = null;
let lastScheduleSentWasUpdated = null;
let lastScheduleItemCount = 0;
let lastReportedShoutingFireListeners = 0;
let lastReportedKflipListeners = 0;
let broadcastingStream = null;


async function getKflipShowsAsync() {

    try {
        kflipShows = await events.get();
        const currentUpdated = new Date(kflipShows.data.updated);
        const itemCount = kflipShows.data.items.length;

        if (!lastScheduleSentWasUpdated ||
            lastScheduleSentWasUpdated < currentUpdated ||
            lastScheduleItemCount != itemCount) {
            //if (true) {
            console.log('A new schedule for everyone! Sending the latest schedule with ' +
                kflipShows.data.items.length +
                ' events');
            lastScheduleSentWasUpdated = currentUpdated;
            lastScheduleItemCount = itemCount;
            kflipShowString = JSON.stringify(kflipShows);

            let keys = Object.keys(io.sockets.sockets);

            keys.forEach(function(key) {
                const connectedSocket = io.sockets.sockets[key];
                connectedSocket.emit('schedule',
                    {
                        username: 'KFLIP',
                        message: kflipShowString
                    });
            });
        }
    } catch (err) {
        console.log('There was an exception -' + err);
    }
}

function getKflipShows() {
    (async () => {
        await getKflipShowsAsync();
    })();
}

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

        if (listeners !== lastReportedKflipListeners) {
            updateKflipListenerCount(listeners);
        }

        if (sameOldSong) {
            return;
        }

        console.log('Now playing: ' + newTitle + ' (' + listeners + ') listeners');
        io.emit('nowplaying', { stream: broadcastingStream });

    } catch (err) {
        if (icecastStatsParseError == false) {
            console.log('Exception in icecast stats: ' + newIcecastStatsJson);
            icecastStatsParseError = true;
        }
    }
}


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
                console.log('ERROR: ' + e.message);
            });
    } catch (err) {
        console.log('Exception in getNowPlayingAsync - ' + err);
    }

}

function updateNowPlaying() {
    (async () => {
        await getNowPlayingAsync();
    })();
}


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
                            console.log('There was a problem finding ShoutingFire listener count');
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

server.listen(port, () => {
    getKflipShows();
    setInterval(getKflipShows, 15000);
    setInterval(updateNowPlaying, 5000);

    checkShoutingFire();
    setInterval(checkShoutingFire, 60000);

    console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));
app.use('/controllers', express.static(path.join(__dirname, 'public/controllers')));

var numUsers = 0;


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
