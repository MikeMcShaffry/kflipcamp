// Change log
// 9f - Now automatically preserves the current song played if any NON-BOT says anything in channel.
//		May need to think about how to handle the web-chat bot.
// 10a - Now using .edit rather than deleting old message and posting new one.
//		This prevents the channel from always showing new messages, when there's not real conversation.
// 11 - Scrapped the idea of reading the stream directly, due to issue w/ multiple connections 
//		(probably a bug in the stream system)

// REQUIRED ITEMS
// node (duh)
// npm 
// discord.js 

// A couple of handy examples & sources:
// https://gist.github.com/eslachance/3349734a98d30011bb202f47342601d3
// https://discord.js.org/#/docs/main/stable/general/welcome



// We're calling our new bot client ... Otto. Inventive. 
const Discord = require('discord.js');
const Otto = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json").otto;												// <<<<<<< I added an otto section to the config file

// config.token - the bot's token
// config.prefix - the message command prefix.
// config.listener_channel_id - the ID of the channel the now playing song is posted
// config.engineering_channel_id - the ID of the channel where Otto can post server messages
// config.nowplayingfile	// full path & filename to NowPlaying file

var fs = require('fs');

var oldfiledata ='oldfiledata';
var newfiledata ='newfiledata';
var listenerChannel;
var engineeringChannel;
var talk = 0 ;	// starting condition of silent
var isReady = false;

var defaultDJ = 'Otto-mation';
var currentDJ = defaultDJ;

let currentIntro = '';

let onCurrentDJChanged = null;
let onStreamChanged = null;
let onPhoneDisplayChanged = null;
let phoneDisplayed = false;

var song_array = ["","","","","","","","","",""] ; // 10 element array. See https://www.w3schools.com/js/js_arrays.asp
var my_message = 0;
var OutString ='Output string, used to dump the song array';


let localFileNowPlayingInterval = null;						// If Otto is scanning a local MediaMonkey file, this will be set to the Interval checking it every two seconds

//
// This event will run if the bot starts, and logs in, successfully.
//
Otto.on("ready", () => {

	try {
		console.log('INFO - otto - Otto starting up. Version 0.11a - local only');
		//console.log('Otto is up and running, with ' +
		//	Otto.users.size + ' users, in ' +
		//	Otto.channels.size + ' channels of ' +
		//	Otto.guilds.size + ' guilds.');

		(async () => {
			listenerChannel = await Otto.channels.fetch(config.listener_channel_id);
			console.log(`INFO - otto - Otto found the listener channel and logged in as ${Otto.user.tag}!`);
			talk = 1;
			engineeringChannel = await Otto.channels.fetch(config.engineering_channel_id);
			console.log(`INFO - otto - Otto found the engineering channel and logged in as ${Otto.user.tag}!`);
			isReady = true;
		})();
	}

	catch (err) {
		console.log('ERROR - otto - Exception in Otto on ready - ' + err.message);
    }
});


//
// This event will run on every single message received, from any channel or DM.
//
Otto.on("message", async message => {

	try {

		// Ignore other bots. 
		// NOTE: REMOVED FOR NOW - due to chatbot handling in the web page
		//if(message.author.bot) return;


		// Any message w/o our command prefix resets the message ID,
		// so it won't delete the most recent song announcement, because it was talked about.
		if (message.content.indexOf(config.prefix) !== 0) {
			if (message.channel === listenerChannel) { 
				if (my_message !== 0 && my_message.author.id != message.author.id) {
					my_message = 0;		// set this to 0, so it won't delete the most recent song announcement, because it was talked about.
				}
			}
			return;
		}

		// Here we separate our "command" name, and our "arguments" for the command. 
		// e.g. if we have the message "+say Is this the real life?" , we'll get the following:
		// command = say
		// args = ["Is", "this", "the", "real", "life?"]
		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();


		// Display the last 10 songs played.
		// TODO: parse out how many to do (default to 10) & display the nn elements of last_played_list
		if (command === "last") {
			var ii = 0;
			OutString = '';
			for (i = 0; i < song_array.length; i++) {
				if (song_array[i] !== '') {
					ii++;
					OutString = OutString + (song_array[i] + '.\n');
				}
			}
			message.channel.send('The last ' + ii + ' songs played:\n' + OutString);
			return;
		}


        // echo what's now playing.
        if (command === "np") {
            message.channel.send(newfiledata);
            return;
        }

        const kflipdj = message.member.roles.cache.some(r => ["DJs"].includes(r.name));

        let helpmsg =
            `Commands are\n\
  !help shows commands\n\
  !np shows the currently playing track\n\
  !last shows the last 10 songs played.`;

        if (kflipdj) {
            helpmsg +=
                `\n---\n\
DJ Commands are\n\
  !shaddap to make me shut up\n\
  !talk starts me talking\n\
  !setdj {who} {link} sets the DJ and an optional link\n\
  !intro {blah} gets me to change my song intro text\n\
    (no parameters on the last two clears them to the default)\n\
  !phone displays or hides the number to KFLIP Central`;
        }

        // Echo the available commands
        if (command === "help") {
            return message.channel.send(helpmsg);
        }


        //////////////////////////////////////////////////////////////////////////////////////////////////
		/////////// From here on down, ONLY DJs //////////////////////////////////////////////////////////

        // Smart-ass reply to non-moderators trying to issue !commands. 
        // TODO: Handle people saying "!!!!", or similar.
        if (!kflipdj) {
            return message.reply("You're not my real mom!!");
        };




		// Wake the bot up by setting the channel ID.
		if (command === "ping") {
			talk = 1;
			listenerChannel = message.channel;
			console.log('INFO - otto - Active channel ID now: ' + listenerChannel);
			message.channel.send('pong.');
			if (config.use_nowplayingfile) {
				clearInterval(localFileNowPlayingInterval);
				localFileNowPlayingInterval = setInterval(localFileNowPlaying, 2000);				// TODO CONFIGURATION - we can put that scan interval in the config file
			}
			return true;
		}


		// Set the text displayed before the now playing track info
        if (command === "setdj") {
            currentDJ = defaultDJ;
            if (args.length !== 0) {
                currentDJ = args.join(" ");
            }
            currentIntro = `${currentDJ} is playing`;

            message.channel.send('Set DJ to ' + currentDJ + '.');

            if (onCurrentDJChanged) {
                onCurrentDJChanged(currentDJ);
            }

			return true;
        }

        if (command === "intro") {
            if (args.length !== 0) {
                currentIntro = args.join(" ");
            } else {
                currentIntro = `${currentDJ} is playing`;
            }

            message.channel.send('Intro changed to ' + currentIntro + '.');

            return true;
        }

        if (command === "phone") {
            phoneDisplayed = !phoneDisplayed;
            let msg = '';

            if (phoneDisplayed)
                msg = "Phone number is visible";
            else
                msg = 'Phone number is hidden'; 

            if (onPhoneDisplayChanged) {
                onPhoneDisplayChanged(phoneDisplayed);
            }
            return message.channel.send(msg);
        }

		if (command === "shaddap") {
			// Silence!
			talk = 0;
			return message.channel.send('Shutting up. !talk to start me up again.');
        }

		if (command === "talk") {
			// Speak!
			talk = 1;
			return message.channel.send('Yapping again.');
        }

		//  MrMike says: taking this out, since this will exit the kflip website process!
		//
		if (command === "exit") {
			if (config.use_nowplayingfile) {
				message.channel.send('Shutting down.');
				process.exit();
				return true;
			}
			console.log('INFO - otto - Otto Exit command not supported on this configuration');
		}

	}

	catch (err) {
		console.log('ERROR - otto - Exception in Otto on message - ' + err.message);
    }
});	// end of on.message handling


// Figure out if what's Now Playing has changed, update if so, then emit the currently playing info.
function localFileNowPlaying() {
	try {
		newfiledata = fs.readFileSync(config.nowplayingfile, 'utf8');

		// If data changed, AND if we're talking, then announce the new song in channel
		if (oldfiledata !== newfiledata) {
			oldfiledata = newfiledata;


			// IF I'm talking, find a way to display the Now Playing
			if (talk === 1) {
				// IF I have a currently active message, just edit it.
				// TODO: handle the error of the message not actually existing anymore
				if (my_message !== 0) {
                    my_message.edit(currentIntro + ' ' + newfiledata);
                    // TODO: handle the error of edit failure due to the message not actually existing anymore
                }
				// If I do NOT have an active message, send a new one and save it.
				else {
					SendToListenerChannel(currentIntro + ' ' + newfiledata);
				}
			}

			// Even if NOT talking
			// update the last_played_message_list - bump them all up one, add this to tail.
			// since they default to empty, this works fine when we start.
			for (let i = 0; i < song_array.length - 1; i++) {
                song_array[i] = song_array[i + 1];
            }
			// TODO: Replace that [9] with .length
			song_array[9] = newfiledata;
		}
	}
	catch (err) {
		console.log('ERROR - otto - Exception in Otto.localFileNowPlaying - ' + err.message);
    }
}


function UpdateNowPlaying(newsong, streamChanged) {

	try {
		newsong = newsong.replace('[Shouting Fire] ', '');

		if (config.use_nowplayingfile) {
			// Otto is running by scanning a local file
			return;
		}

		newfiledata = newsong;

		if (oldfiledata !== newfiledata) {
			oldfiledata = newfiledata;

			// IF I'm talking, find a way to display the Now Playing
			if (talk === 1) {
				// IF I have a currently active message, just edit it.
				// TODO: handle the error of the message not actually existing anymore
				if (my_message !== 0) {
                    my_message.edit(currentIntro + ' ' + newfiledata);
                    // TODO: handle the error of edit failure due to the message not actually existing anymore
                }
				// If I do NOT have an active message, send a new one and save it.
				else {
					SendToListenerChannel(currentIntro + ' ' + newfiledata);
				}
			}

			// Even if NOT talking
			// update the last_played_message_list - bump them all up one, add this to tail.
			// since they default to empty, this works fine when we start.
			for (let i = 0; i < song_array.length - 1; i++) {
                song_array[i] = song_array[i + 1];
            }
			// TODO: Replace that [9] with .length
			song_array[9] = newfiledata;
        }

        if (streamChanged) {
            currentDJ = defaultDJ;
            currentIntro = `${currentDJ} is playing`;
        }
	}
	catch (err) {
		console.log('ERROR - otto - Exception in Otto.UpdateNowPlaying', err);
	}
}

function EngineeringLogEntry(message) {
	if (engineeringChannel) {
		engineeringChannel.send(message);
	}
}

function SendToListenerChannel(message) {
	if (listenerChannel) {
		listenerChannel.send(message).then((sentMessage) => {
			my_message = sentMessage 
		});
	}
}

function start(onCurrentDJChangedCallback, onPhoneDisplayedCallback) {
    // TODO: Really should use fs.FSWatcher instead. See: https://stackoverflow.com/questions/35115444/nodejs-fs-fswatcher
	// set how often to call the nowPlaying function. Start with 2 seconds
	try {
        if (config.enabled) {

			Otto.login(config.token);

			if (config.use_nowplayingfile) {
				localFileNowPlayingInterval = setInterval(localFileNowPlaying, 2000);
            }

            if (onCurrentDJChangedCallback) {
                onCurrentDJChanged = onCurrentDJChangedCallback;
            }

            if (onPhoneDisplayedCallback) {
                onPhoneDisplayChanged = onPhoneDisplayedCallback;
            }
        }
		else {
			console.log('WARNING - otto - Otto Discord integration is NOT enabled - check config.json');
		}
	}
	catch (err) {
		console.log(`ERROR - otto - Exception in Otto.start ${err.message}`);
	}

}

//
// Running otto locally - node otto.js will execute this code and check the use_nowplayingfile config setting
//
if (config.use_nowplayingfile) {
	console.log('INFO - otto - Running Otto locally');
	Start();
}


function IsReady() {
	return isReady;
}

if (!module.exports.UpdateNowPlaying) {
	module.exports.Start = start;
    module.exports.UpdateNowPlaying = UpdateNowPlaying;
    module.exports.EngineeringLogEntry = EngineeringLogEntry;
    module.exports.SendToListnerChannel = SendToListenerChannel;
    module.exports.CurrentDJ = currentDJ;
    module.exports.DefaultDJ = defaultDJ;
    module.exports.IsReady = IsReady;
	module.exports.Enabled = config.enabled;
}





