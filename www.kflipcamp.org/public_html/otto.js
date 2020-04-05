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
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message command prefix.
// config.mychannelID 	
// config.nowplayingfile	// full path & filename to NowPlaying file

var fs = require('fs');

var oldfiledata ='oldfiledata';
var newfiledata ='newfiledata';
var mychannelID ; // #listener-lounge is 565965887287459848
var talk = 0 ;	// starting condition of silent
var currentDJ = 'Now playing' ;
var song_array = ["","","","","","","","","",""] ; // 10 element array. See https://www.w3schools.com/js/js_arrays.asp
var my_message = 0;
var OutString ='Output string, used to dump the song array';


Otto.login(config.token);

	// This event will run if the bot starts, and logs in, successfully.
Otto.on("ready", () => {
	console.log ('Otto starting up. Version 0.11a - local only');
	console.log('Otto is up and running, with ' + 
	Otto.users.size + ' users, in ' + 
	Otto.channels.size + ' channels of ' + 
	Otto.guilds.size + ' guilds.'); 
	mychannelID = Otto.channels.get("565965887287459848");	// main chat channel
	//mychannelID = Otto.channels.get("599093293506363402");	// Bot Testing channel
	console.log ('Active channel ID: ' + mychannelID);
	talk = 1;
	fs.access(config.nowplayingfile, error => {
		if (!error)
		{
			console.log(config.nowplayingfile + ' exists');
		} else {
			console.log(config.nowplayingfile + ' does not exist! You must create it.');
			process.exit();
		}
	});

});



  // This event will run on every single message received, from any channel or DM.
Otto.on("message", async message => {
  // Ignore other bots. 
  // NOTE: REMOVED FOR NOW - due to chatbot handling in the web page
  //if(message.author.bot) return;
  

  // Any message w/o our command prefix resets the message ID,
  // so it won't delete the most recent song announcement, because it was talked about.
  if(message.content.indexOf(config.prefix) !== 0){ 
	  if(message.channel == mychannelID){ // ONLY if the message was in the now-talking channel
		  my_message=0;		// set this to 0, so it won't delete the most recent song announcement, because it was talked about.
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
	if(command === "last") {
		var ii = 0;
		OutString='';
		for (i=0; i<song_array.length; i++){
			if(song_array[i] != '') {
				ii++;
				OutString = OutString + (song_array[i] + '.\n');
			}
		}
		message.channel.send ('The last ' + ii + ' songs played:\n' + OutString);
		return; 
	}



	//////////////////////////////////////////////////////////////////////////////////////////////////
	/////////// From here on down, ONLY DJs //////////////////////////////////////////////////////////
	
	// Smart-ass reply to non-moderators trying to issue !commands. 
	// TODO: Handle people saying "!!!!", or similar.
	if(!message.member.roles.some(r=>["DJs"].includes(r.name)) ){
		return message.reply("You're not my real mom!!");
	};
  
	// echo what's now playing.
	if(command === "np") {
		message.channel.send ( newfiledata ); 
		return; 
	}

	// Wake the bot up by setting the channel ID.
	if(command === "ping") {
		talk = 1;
		mychannelID = message.channel;
		console.log ('Active channel ID now: ' + mychannelID);
		message.channel.send( 'pong.');
		clearInterval(howOften);
		howOften=setInterval(nowPlaying,2000);
		return; 
	}

	// Echo the available commands
	if(command === "help") {
		message.channel.send( '!shaddap to make me shut up \n !talk starts me talking \n !intro sets the DJ "now playing" text \n !np shows the currently playing track \n !last shows the last 10 songs played.'
		);
		return; 
	}

	// Set the text displayed before the now playing track info
	if(command === "intro") {
		currentDJ = args.join(" ");
		message.channel.send( 'Current DJ text: ' + currentDJ + '.' );
		return; 
	}

	if(command === "shaddap") {
		// Silence!
		talk = 0;
		message.channel.send( 'Shutting up. !talk to start me up again.' );
		return; 
	}

	if(command === "talk") {
		// Speak!
		talk = 1;
		message.channel.send( 'Yapping again.' );
		return; 
	}

	if(command === "exit") {
		message.channel.send( 'Shutting down.' );
		process.exit();
		return; 
	}

});	// end of on.message handling



// TODO: Really should use fs.FSWatcher instead. See: https://stackoverflow.com/questions/35115444/nodejs-fs-fswatcher
// set how often to call the nowPlaying function. Start with 2 seconds
var howOften = setInterval(nowPlaying, 2000);

// Figure out if what's Now Playing has changed, update if so, then emit the currently playing info.
function nowPlaying() {
	newfiledata = fs.readFileSync(config.nowplayingfile, 'utf8');
		
	// If data changed, AND if we're talking, then announce the new song in channel
	if (oldfiledata != newfiledata){
		oldfiledata = newfiledata;

		// IF I'm talking, find a way to display the Now Playing
		if (talk==1) {
			// IF I have a currently active message, just edit it.
			// TODO: handle the error of the message not actually existing anymore
			if (my_message!=0) { 
				my_message.edit(currentDJ + ' ' + newfiledata)
				// TODO: handle the error of edit failure due to the message not actually existing anymore
			}
			// If I do NOT have an active message, send a new one and save it.
			else {
				mychannelID.send(currentDJ + ' ' + newfiledata)
				.then((sentMessage) => {my_message=sentMessage	});
			}
		}

		// Even if NOT talking
		// update the last_played_message_list - bump them all up one, add this to tail.
		// since they default to empty, this works fine when we start.
		for (i=0; i<song_array.length-1; i++){
			song_array[i]=song_array[i+1]
		}
		// TODO: Replace that [9] with .length
		song_array[9]=newfiledata;
	}	
}

