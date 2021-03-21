//
// twitter.js - A simple bot to post events to a Twitter account
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT licence

const TwitterClient = require('twitter-api-client');
const config = require("./config.json").twitterapp_otto;
const cron = require('node-cron');
const moment = require('moment');
const events = require('./events.js');

let twitterClient = null;
let site_url = null;

const MAX_CONSECUTIVE_ERRORS = 5;
const MAX_TWEET_LENGTH = 270;
const MAX_EVENT_SUMMARY_LENGTH = 80;
const ONE_DAY_MILLISECONDS = 1000 * 60 * 60 * 24
let consecutiveErrors = 0;



//
// Start - creates the Twitter client 
//
async function Start(_site_url) {
    try {
        if (config.enabled === false) {
            console.log("INFO - twitter - module is disabled");
            return;
        }
        
        site_url = _site_url;
        twitterClient = new TwitterClient.TwitterClient(config.auth);
        console.log("INFO - twitter - module is initialized");

        // Schedule tasks to be run on the server.
        cron.schedule(`* ${config.dailyAnnnouncementHourUTC} * * *`, function() {
            MakeAnnouncement();
        });
        // Useful for testing the Twitter daily announcement - DONT DEPLOY THIS!
        //cron.schedule(`*/1 * * * *`, function() {
        //    MakeAnnouncement();
        //});
        
    }
    catch(error) {  
        console.log(`ERROR - twitter - exception authenticating to Twitter - ${error.message}`);
    }
}

async function OnStartEvent_Internal(event) {
    try {
        if (!config.enabled) {
            return;
        }
        await twitterClient.tweets.statusesUpdate(
            {status: `On the air now...\n${event.summary}\nListen at ${site_url}`});
        console.log("INFO - twitter - sent event start status update");
        consecutiveErrors = 0;         
    }
    catch(error) {
        ++consecutiveErrors;
        console.log(`ERROR - twitter - exception in OnStartEvent_Internal - ${error.data}`);
    }
    
    if (consecutiveErrors > MAX_CONSECUTIVE_ERRORS) {
        console.log("ERROR - twitter - Too many consecutive errors - disabling the module");
        config.enabled = false;
    }
}


async function OnStartEvent(event) {
    // TODO POLISH - This would be good to call in a loop with backoff if it doesn't succeed.
    await OnStartEvent_Internal(event);
}



function MakeAnnouncement() {
    MakeAnnouncementAsync();
}

async function MakeAnnouncementAsync() {
    
    try {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + ONE_DAY_MILLISECONDS);
        let results = await events.GetEventsByDate(now.toISOString(), tomorrow.toISOString())

        
        if (!results || !results.data || !results.data.items || results.data.items.length == 0) {
            console.log("INFO - twitter - module detects no events today");
            return;
        }

        let header = "LIVE events later today on KFLIP: (central US time)\n";
        let message = header;
        let i = 0;
        while (i<results.data.items.length) {
            const event = results.data.items[i];
            const time = moment(event.startDate).format("ha");
            let eventDesc = `${time} - ${event.summary}\n`;

            if (eventDesc.length > MAX_EVENT_SUMMARY_LENGTH) {
                eventDesc = `${eventDesc.substring(0, MAX_EVENT_SUMMARY_LENGTH)}...`;    
            }
            
            if (message.length + eventDesc.length > MAX_TWEET_LENGTH) {
                await twitterClient.tweets.statusesUpdate({status: message});
                message = header;
                continue;
            }
            message += eventDesc;
            ++i;
        }

        await twitterClient.tweets.statusesUpdate({status: message});
        console.log("INFO - twitter - making daily annoucement");
    }
    catch(error) {
        console.log(`ERROR - twitter - exception making the daily announcement - ${error.message}`);
    }
}

if (!module.exports.Start) {
    module.exports.Start = Start;
    module.exports.OnStartEvent = OnStartEvent;
}
