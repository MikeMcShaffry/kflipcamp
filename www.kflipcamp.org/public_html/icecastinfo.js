//
// icecastinfo.js - Can grab now player and listener count information from an icecast server
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT licence


// Variables that hold listener counts and broadcast stream
let lastReportedShoutingFireListeners = 0;
let lastReportedListeners = 0;                      // number of listeners last reported on the current broadcast stream
let broadcastingStream = null;                      // an icecast status object that describes the stream currently broadcasting

let onSomethingNewPlaying = null;                   // a callback for when the stream changes or the song playing changes
let onListenerCountChanged = null;                  // a callback for then the listener count is updated

let onShoutingFireUpdated = null;

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
        if (icecastStatsParseError === false) {
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
            broadcastingStream.title = newSource.title;
            sameOldSong = false;
        }

        // Go ahead and update the listencount while we are at it
        if (listeners !== lastReportedListeners) {
            lastReportedListeners = listeners;
            if (onListenerCountChanged) {
                onListenerCountChanged(listeners);
            }
        }

        // If the streams are different, bail out - otherwise emit the new song information to the connected browsers
        if (sameOldSong) {
            return;
        }

        if (onSomethingNewPlaying) {
            onSomethingNewPlaying(broadcastingStream, listeners);
        }


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
                            checkForSomethingNew(body.toString());

                            //console.log('BODY: ' + body);
                        });
            });

        req.on('error',
            function (e) {
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

                                $('h3').each(function (i, e) {
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

                                        $('td', infoTable).each(function (i, e) {
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

                                    if (onShoutingFireUpdated) {
                                        onShoutingFireUpdated(shoutingFireListeners);
                                    }
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


function Start(_onSomethingNewPlaying, _onListenerCountChanged) {
    onSomethingNewPlaying = _onSomethingNewPlaying;                   // a callback for when the stream changes or the song playing changes
    if (!onSomethingNewPlaying) {
        console.log('WARNING - icecastinfo.js would be more useful if there was a handler for new now playing events');
    }

    onListenerCountChanged = _onListenerCountChanged;                   // a callback for when the stream changes or the song playing changes
    if (!onListenerCountChanged) {
        console.log('WARNING - icecastinfo.js would be more useful if there was a handler for new listener count update events');
    }
    setInterval(updateNowPlaying, 5000);
}

function CheckShoutingFire(_onShoutingFireUpdated) {

    onShoutingFireUpdated = _onShoutingFireUpdated;
    if (!onSomethingNewPlaying) {
        console.log('WARNING - icecastinfo.js would be more useful if there was a handler for new now playing events');
    }

    checkShoutingFire();
    setInterval(checkShoutingFire, 60000);

}

function GetCurrentStream() {
    return broadcastingStream;
}



if (!module.exports.Start) {
    module.exports.Start = Start;
    module.exports.CheckShoutingFire = CheckShoutingFire;
    module.exports.GetCurrentStream = GetCurrentStream;
}



