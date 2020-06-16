/* '(C) 2020 KFLIP Camp - licensed under the MIT license see: license.txt for details' */

(function () {
    var currState;
    var player = app.player;
    var track;
    var lastTrackInfo;
    var lastTrackPlayedDurationMS = 0;
    var lastTrackPlayStart;
	
	var lastJinglePlayStart = Date.now();  


	
    var _settings = null;

	window.kfliputilities = {
		// kflipUtilities.js: settings - accessor for kflipUtilities settings
		settings: function () {
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
		},

		// kflipUtilities.js: saveSettings - when the settings in the options change, this function saves them
		saveSettings: function(newSettings) {
			_settings = newSettings;
			app.setValue('_kflipUtils', _settings);
			app.notifySettingsChange();
			ODS('kfliputilities: saveSettings called with settings = ' + JSON.stringify(_settings));
		}
	};
	
	
	// kflipUtilities.js: outputNowPlaying - 
	var outputNowPlaying = async function () {
		if (!settings().outputNowPlaying) {
			return;
		}
		
		ODS('kfliputilities: outputNowPlaying()');
		
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

        var nowPlayingPath = app.filesystem.getUserFolder() + 'MediaMonkey5_NowPlaying.txt';
		ODS(`kfliputilities: outputNowPlaying will try to write ${nowPlaying} into ${nowPlayingPath}` );
		
		try {
			await app.filesystem.saveTextToFileAsync(nowPlayingPath, nowPlaying );
			ODS(`kfliputilities: outputNowPlaying wrote ${nowPlaying} into ${nowPlayingPath}` );	
		}	
		catch(err) {
			ODS('kfliputilities: some kind of error happened! ' + err.message);
		}
	}
	

	

	var checkJingle = async function () {
		
		if (!settings().playJingles) {
			return;
		}	
		
		ODS('kfliputilities: checkJingle()');
		

		
	}




    var handleTrackChange = async function () {
		ODS('kfliputilities: handleTrackChange');
		
		await outputNowPlaying();		
		//await checkJingle();
    };

    var handleTrackEnd = function () {
		ODS('kfliputilities: handleTrackEnd');
    };

    var handleTrackPlay = async function () {
		ODS('kfliputilities: handleTrackPlay');
		
		await outputNowPlaying();
		//await checkJingle();
    };

    var onPlaybackState = function (state) {
		
        ODS('kfliputilities: onPlaybackState ' + state);
        switch (state) {
            case 'unpause':
                if (currState !== 'play') {
                    currState = 'play';
                    lastTrackPlayStart = Date.now();
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
                if (lastTrackPlayStart > 0) {
                    lastTrackPlayedDurationMS += Date.now() - lastTrackPlayStart;
                }
                lastTrackPlayStart = 0;
                handleTrackEnd();
                currState = state;
                break;
            case 'pause':
                currState = state;
                if (lastTrackPlayStart > 0) {
                    lastTrackPlayedDurationMS += Date.now() - lastTrackPlayStart;
                }
                lastTrackPlayStart = 0;
                break;
            case 'trackChanged':
                handleTrackChange();
                break;
        };
    };

    localListen(player, 'playbackState', onPlaybackState);
})();
