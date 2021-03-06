/* '(C) 2020 KFLIP Camp - licensed under the MIT license see: license.txt for details' */

localRequirejs('kfliputilities');



var kflipUI;
var kflipSettings = {};

optionPanels.pnl_Library.subPanels.pnl_kflipUtils.load = async function (sett) {

    kflipUI = getAllUIElements(qid('lastKflipSettings'));

    ODS('kfliputilities pnl_kflipUtils.init called');
    kflipSettings = kfliputilities.settings();
	ODS('kfliputilities read settings ' + JSON.stringify(kflipSettings));
	
	// Output Now Playing checkbox
    kflipUI.chbOutputNowPlaying.controlClass.checked = kflipSettings.outputNowPlaying;
    kflipUI.chbOutputNowPlaying.controlClass.localListen(kflipUI.chbOutputNowPlaying, 'change', function () {
		kflipSettings.outputNowPlaying = kflipUI.chbOutputNowPlaying.controlClass.checked;
		ODS(`kfliputilities: pnl_kflipUtils outputNowPlaying has changed to ${kflipSettings.outputNowPlaying}` );		
    });	
	
	// Now Playing File edit control
	kflipUI.editNowPlayingFile.controlClass.value = kflipSettings.nowPlayingFile;
    kflipUI.editNowPlayingFile.controlClass.localListen(kflipUI.editNowPlayingFile, 'change', function () {
		kflipSettings.nowPlayingFile = kflipUI.editNowPlayingFile.controlClass.value;
		ODS(`kfliputilities: pnl_kflipUtils editNowPlayingFile has changed to ${kflipSettings.nowPlayingFile}`);		
    });
	
	// Play Jingles checkbox
    kflipUI.chbPlayJingles.controlClass.checked = kflipSettings.playJingles;
    kflipUI.chbPlayJingles.controlClass.localListen(kflipUI.chbPlayJingles, 'change', function () {
		kflipSettings.playJingles = kflipUI.chbPlayJingles.controlClass.checked;
		ODS(`kfliputilities: pnl_kflipUtils playJingles has changed to ${kflipSettings.playJingles}`);		
    });
	
	// Jingle playlist edit control
	kflipUI.editJinglePlaylist.controlClass.value = kflipSettings.jinglePlaylist;
    kflipUI.editJinglePlaylist.controlClass.localListen(kflipUI.editJinglePlaylist, 'change', function () {
		kflipSettings.jinglePlaylist = kflipUI.editJinglePlaylist.controlClass.value;
		ODS(`kfliputilities: pnl_kflipUtils editJinglePlaylist has changed to ${kflipSettings.jinglePlaylist}`);		
    });	
	
	// Jingle delay time edit control
	kflipUI.editJingleDelayTime.controlClass.value = kflipSettings.jingleDelayTime;
    kflipUI.editJingleDelayTime.controlClass.localListen(kflipUI.editJingleDelayTime, 'change', function () {
		kflipSettings.jingleDelayTime = kflipUI.editJingleDelayTime.controlClass.value;
		ODS(`kfliputilities: pnl_kflipUtils editJingleDelayTime has changed to ${kflipSettings.jingleDelayTime}`);		
    });		 
	
	window.allPlaylists = [];
	
	var readPlaylists = async function (playlists, plst, prefix) {
		var items = plst.getChildren();
		await items.whenLoaded();

		if (prefix) {
			prefix = prefix + " - ";
		}

		var i, newplst, title;
		for (i = 0; i < items.count; i++) {
			items.locked(function () {
				newplst = items.getValue(i);
			});
			title = prefix + newplst.title;
			if (!playlists[title]) {
				playlists[title] = newplst;
			}
			await readPlaylists(playlists, newplst, title);
		}
	};

	/*
	One day I'll get back to figuring out how dropdowns work.
	
	try {
		// Prepare a list of all playlists
		await readPlaylists(window.allPlaylists, app.playlists.root, "");		
		
		kflipUI.dropdownJinglePlaylist.controlClass.datasource = window.allPlaylists;
		//kflipUI.dropdownJinglePlaylist.controlClass.focusedIndex = 0;
		
		kflipUI.dropdownJinglePlaylist.controlClass.localListen(kflipUI.dropdownJinglePlaylist, 'change', function () {
			kflipSettings.jinglePlaylist = window.allPlaylists[kflipUI.chbPlayJingles.controlClass.focusedIndex];
			ODS(`kfliputilities: pnl_kflipUtils jinglePlaylist has changed to ${kflipSettings.jinglePlaylist}`);		
		});		
		
		
	}
	catch(err) {
		ODS('kfliputilities: some kind of error happened! ' + err.message);
	}	
	*/
	
	
	
};

optionPanels.pnl_Library.subPanels.pnl_kflipUtils.save = function (sett) {
	kfliputilities.saveSettings(kflipSettings);
};
