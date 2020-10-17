/* '(C) 2020 KFLIP Camp - licensed under the MIT license see: license.txt for details' */

(function () {
    var currState;
    var player = app.player;
    var track;
	
	var nextJinglePlay = null;
	var counter = 0;
	var checkingJingle = false;
	
    var _settings = null;

	var getSettings = function () {
		if (!_settings) {

			ODS('kfliputilities: Reading settings from application store');
			_settings = app.getValue('_kflipUtils', {
				outputNowPlaying: true,
				nowPlayingFile: '',
				playJingles: false,
				jinglePlaylist: '',
				jingleDelayTime: 2000
			});
		}
		return _settings;
	}

	var saveSettings = function(newSettings) {
		_settings = newSettings;
		app.setValue('_kflipUtils', _settings);
		app.notifySettingsChange();
		ODS('kfliputilities: saveSettings called with settings = ' + JSON.stringify(_settings));
    }



	window.kfliputilities = {
		// kflipUtilities.js: settings - accessor for kflipUtilities settings
		settings: function () {
			return getSettings();
		},

		// kflipUtilities.js: saveSettings - when the settings in the options change, this function saves them
		saveSettings: function(newSettings) {
			saveSettings(newSettings);
		}
	};
	
	
	// kflipUtilities.js: outputNowPlaying - 
	var outputNowPlaying = async function () {

		ODS('kfliputilities: outputNowPlaying()');

		if (!getSettings().outputNowPlaying) {
			return;
		}	
		
	    track = player.getCurrentTrack(); // cannot use fast, we will need this for async operation
		//ODS('kfliputilities: track info is ' + JSON.stringify(track));
		
		let nowPlaying = '';
		// If the album is nothing but whitespace, just use the artist and title
		if (!track || !track.artist || !track.title) {
			nowPlaying = 'unknown';
		}
		if (!track.album.replace(/\s/g, '').length) {
			nowPlaying = `${track.artist} - ${track.title}`;
		}
		else {
			nowPlaying = `${track.artist} - ${track.title} off *${track.album}*`
		}

		var nowPlayingPath = app.filesystem.getUserFolder() + getSettings().nowPlayingFile;
		ODS(`kfliputilities: outputNowPlaying will try to write ${nowPlaying} into ${nowPlayingPath}` );
		
		try {
			await app.filesystem.saveTextToFileAsync(nowPlayingPath, nowPlaying );
			ODS(`kfliputilities: outputNowPlaying wrote ${nowPlaying} into ${nowPlayingPath}` );	
		}	
		catch(err) {
			ODS('kfliputilities: some kind of error happened! ' + err.message);
		}
	}
	

	var checkJingle = async function (calledFrom) {

		try {
			ODS(`kfliputilities: checkJingle called _||_ from=${calledFrom}`);
			
			const now = Date.now();
			if (nextJinglePlay !== null && nextJinglePlay > now) {
				ODS(`kfliputilities: checkJingle - Not time to play jingle _||_ nextJinglePlay=${nextJinglePlay} now=${now}`);
				return;
			}
			
			if (!getSettings().playJingles) {
				ODS('kfliputilities: checkJingle - playJingles is FALSE');
				return;
			}


			if (nextJinglePlay === null) {
				nextJinglePlay = now + (getSettings().jingleDelayTime * 1000);
				ODS(`kfliputilities: checkJingle - starting the counter now nextJinglePlay will be at ${nextJinglePlay}`);
				return;
            }



			ODS(`kfliputilities: checkJingle - it is time to play a jingle _||_ nextJinglePlay=${nextJinglePlay} now=${now}`);
			const jinglePlaylist = getSettings().jinglePlaylist;
			let playlist = await app.playlists.getByTitleAsync(jinglePlaylist);
			if (!playlist) {
				ODS(`kfliputilities: checkJingle - Playlist ${jinglePlaylist} does not exist`);
				return;
			}

			let tracklist = await playlist.getTracklist();
			await tracklist.whenLoaded();
			tracklist.locked(async function () {
				if (tracklist.count > 0) {

					let trackNum = Math.floor(Math.random() * tracklist.count);
														
					//var tmpPath = app.filesystem.getUserFolder() + 'MediaMonkeyDebug.txt';
					//await app.filesystem.saveTextToFileAsync(tmpPath, JSON.stringify(tracks));

					nextJinglePlay = now + (getSettings().jingleDelayTime * 1000);
					
					let jingle = tracklist.getValue(trackNum);
					await app.player.addTracksAsync(jingle, { afterCurrent: true } );
					ODS(`kfliputilities: checkJingle - Added a jingle after the current song _||_ nextJinglePlay=${nextJinglePlay}`);
				}
            });
			

		}
		catch (err) {
			ODS(`kfliputilities: checkJingle - There was an exception! ${err.message}`);
		}
	}




    var handleTrackChange = async function () {
		ODS('kfliputilities: handleTrackChange');
    };

    var handleTrackEnd = function () {
		ODS('kfliputilities: handleTrackEnd');
    };

    var handleTrackPlay = async function () {

		try {
			++counter;
			ODS(`kfliputilities: counter is ${counter}`);

			ODS('kfliputilities: handleTrackPlay is being called with settings set to ' + JSON.stringify(getSettings()));

			await checkJingle('handleTrackPlay');
			await outputNowPlaying();

		}
		catch (err) {
			ODS(`kfliputilities: There was an exception! ${err.message}`);
		}

    };

    var onPlaybackState = function (state) {
		
        ODS('kfliputilities: onPlaybackState ' + state);
        switch (state) {
            case 'unpause':
                if (currState !== 'play') {
                    currState = 'play';
					const now = Date.now();
					nextJinglePlay = now + (getSettings().jingleDelayTime * 1000);					
                }
				
                break;
            case 'play':
                if (currState !== 'play') {
                    currState = 'play';
                    handleTrackPlay();
                }
                break;
            case 'stop':
            case 'end':
                handleTrackEnd();
                currState = state;
                break;
            case 'pause':
                currState = state;
                lastTrackPlayStart = 0;
                break;
            case 'trackChanged':
                handleTrackChange();
                break;
        };
    };

    localListen(player, 'playbackState', onPlaybackState);
})();
