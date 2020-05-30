//
// library.js - Open and search a SQLLite database used by MediaMonkey
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT licence

const http = require('http');


const config = require("./config.json").lastfm;	

const Strings = {
    NoAlbumSummaryAvailable: "No album summary available."
}

let AlbumSummary = Strings.NoAlbumSummaryAvailable;
let AlbumImage = config.noAlbumImageAvailable;

let onAlbumInfoChange = null;

//
// Start - checks the configuration of lastfm
//
async function Start(_onAlbumInfoChange) {

    onAlbumInfoChange = _onAlbumInfoChange;
    if (!onAlbumInfoChange) {
        console.log('WARNING - lastfm.js would be more useful if there was a handler for album info change events');
    };

    if (config.enabled) {
        console.log('LastFm module is started')
    }
}


//
// SetToUnkown() - Called when the album info is not available
//
function SetToUnknown() {
    console.log(`No LastFM album information for artist ${lastArtist} off ${lastAlbum}`);
    let sendUpdate = false;

    if (AlbumSummary !== Strings.NoAlbumSummaryAvailable) {
        AlbumSummary = Strings.NoAlbumSummaryAvailable;
        sendUpdate = true;
    }

    if (AlbumImage !== config.noAlbumImageAvailable) {
        AlbumImage = config.noAlbumImageAvailable;
        sendUpdate = true;
    }

    if (sendUpdate) {
        if (onAlbumInfoChange) {
            onAlbumInfoChange(AlbumSummary, AlbumImage);
        }
    }
}

//
// UpdateNowPlaying - accepts the song title in 'artist - song - album' format and acquires details about the album from lastfm
//

let lastArtist = '';
let lastAlbum = '';
async function UpdateNowPlaying(title) {
    let allParts = null;

    try {
        if (config.enabled === false) {
            return;
        }

        title = title.replace('[Shouting Fire]', '');

        // OutputNowPlaying script sends title string like - The Beatles - All Together Now off *The Yellow Submarine*
        allParts = title.match(/(.+) - (.+) off *(.+)*$/);
        if (!allParts || allParts.length !== 4) {
            SetToUnknown();
            return;
        }

        lastArtist = allParts[1];
        lastAlbum = allParts[3];

        var url = encodeURI(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${config.apikey}&artist=${lastArtist}&album=${lastAlbum}&format=json`);

    //console.log(`Asking LastFM about ${lastArtist} - ${allParts[2]} off *${lastAlbum}*`);
    //console.log(url);

        var req = http.get(url,
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

                            ParseLastFmAlbumInfo(body.toString());
                            //console.log(`Album image is set to ${AlbumImage}`);

                            //console.log('BODY: ' + body);
                        });
            });

        req.on('error',
            function (e) {
                console.log('Error calling GET http://ws.audioscrobbler.com/ - ' + e.message);
            });
    } catch (err) {
        console.log('Exception in lastfm.UpdateNowPlaying - ' + err.message);
    }

}

//
// ParseLastFmAlbumInfo(albumInfoJson) - parses the album info and saves the mega album cover (usually 300x300 - so not so mega, really), 
//

const ImageSizeScore = {
    "mega": 10,
    "extralarge": 9,
    "large": 8,
    "medium": 7,
    "small": 6
}

function ParseLastFmAlbumInfo(lastFmJson) {

// Error return is
// { "error": 6, "message": "Album not found", "links": [] }


// Format for normal return is 
//   {
//   	"album": {
//   		"name": "The Dark Side Of The Moon",
//   		"artist": "Pink Floyd",
//   		"mbid": "9290923d-3b97-45ab-aac1-4880980c72ed",
//   		"url": "https://www.last.fm/music/Pink+Floyd/The+Dark+Side+Of+The+Moon",
//   		"image": [{
//   			"#text": "<- link ->",
//   			"size": "small"
//   		}, {
//   			"#text": "<- link ->",
//   			"size": "medium"
//   		}, {
//   			"#text": "<- link ->",
//   			"size": "large"
//   		}, {
//   			"#text": "<- link ->",
//   			"size": "extralarge"
//   		}, {
//   			"#text": "<- link ->",
//   			"size": "mega"
//   		}, {
//   			"#text": "<- link ->",
//   			"size": ""
//   		}],
//   		"listeners": "1240309",
//   		"playcount": "40382916",
//   		"tracks": {
//   			"track": []
//   		},
//   		"tags": {
//   			"tag": [
//   			{
//   				"name": "Progressive rock",
//   				"url": "https://www.last.fm/tag/Progressive+rock"
//   			}, 
//   			...
//   			]
//   		},
//   		"wiki": {
//   			"published": "20 Aug 2008, 09:44",
//   			"summary": "...",
//   			"content": "..."
//   		}
//   	}
//   }


    try {
        var lastFmResults = JSON.parse(lastFmJson);
        if (!lastFmResults) {
            SetToUnknown();
            return;
        }

        if (lastFmResults.error) {
            console.log('LastFM returned an error', lastFmResults);
            SetToUnknown();
            return;
        }

        if (!lastFmResults.album) {
            SetToUnknown();
            return;
        }

        let albumInfo = lastFmResults.album;

        // See if there is a summary available
        if (albumInfo.wiki && albumInfo.wiki.summary) {
            AlbumSummary = albumInfo.wiki.summary;
        }
        else {
            AlbumSummary = Strings.NoAlbumSummaryAvailable;
        }

        // See if there is an image available - iterate through the image links and choose the best size


        AlbumImage = config.noAlbumImageAvailable;
        if (!albumInfo.image) {
            SetToUnknown();
            return;
        }

        let bestScoreSoFar = 0;

        for (var i = 0; i < albumInfo.image.length; ++i) {
            let image = albumInfo.image[i];

            if (image['#text'].length > 0 && Object.keys(ImageSizeScore).includes(image.size)) {
                if (bestScoreSoFar < ImageSizeScore[image.size]) {
                    bestScoreSoFar = ImageSizeScore[image.size];
                    AlbumImage = image['#text'];
                }
                else if (bestScoreSoFar === 0) {
                    // Covers the unknown, unsized link
                    bestScoreSoFar = 1;
                    AlbumImage = image['#text'];
                }
            }
        }

        //console.log(`LastFM found album image for artist ${lastArtist} off ${lastAlbum}`);
        if (onAlbumInfoChange) {
            onAlbumInfoChange(AlbumSummary, AlbumImage);
        }
    }
    catch (err) {
        console.log('Exception in parseLastFmAlbumInfo', err);
        SetToUnknown();
    }
}


if (!module.exports.Start) {
    module.exports.Start = Start;
    module.exports.UpdateNowPlaying = UpdateNowPlaying;
    module.exports.AlbumSummary = AlbumSummary;
    module.exports.AlbumImage = AlbumImage;
    module.exports.Enabled = config.enabled;
}
