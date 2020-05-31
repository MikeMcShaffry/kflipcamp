//
// events.js - Grabs a google calenadar and emits events to connected browsers
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT licence, with the EXCEPTION of embedded passwords and authentication keys.

// Here we load the config.json file that contains our token and our prefix values. 

const config = require("./config.json").googlecalendar;			// <<<<<<< I added a google calendar section to the config file


const { google } = require('googleapis');
const cal = google.calendar({
    version: 'v3',
    auth: config.auth
});

async function getEventList() {

    // Set beginning of query to yesterday
    let startDate = new Date();

    let list = await cal.events.list({
        // Set times to ISO strings as such
        timeMin: new Date(startDate).toISOString(),
        calendarId: config.calendarId
    });

    list.data.items.forEach(function(event) {
        event.startDate = new Date(event.start.dateTime);
    });

    let sortedItems = list.data.items.sort(function (a, b) { return a.startDate - b.startDate; });
    list.data.items = sortedItems;
    return list;
}


// Variables that hold calendar information
let eventList = null;                               // an array of scheduled events
let onScheduleChange = null;                        // a callback function to handle schedule changes
let lastScheduleSentWasUpdated = null;              // the date of the last schedule change (stored at Google calendar)
let lastScheduleItemCount = 0;                      // the number of scheduled events

let currentEvents = {};                             // events where the start and end times are withing the buffer time

let onEventStart = null;                            // callback for event start
let onEventEnd = null;                              // callback for event end

//
// getEventsAsync() -  Grab the KFLIP calendar and if there are any changes, emit them to any connected browsers
//
async function getEventsAsync() {

    try {
        eventList = await getEventList();
        const currentUpdated = new Date(eventList.data.updated);
        const itemCount = eventList.data.items.length;

        if (!lastScheduleSentWasUpdated ||
            lastScheduleSentWasUpdated < currentUpdated ||
            lastScheduleItemCount !== itemCount) {
            //if (true) {
            console.log('A new schedule for everyone! Sending the latest schedule with ' +
                eventList.data.items.length +
                ' events');
            lastScheduleSentWasUpdated = currentUpdated;
            lastScheduleItemCount = itemCount;

            if (onScheduleChange) {
                onScheduleChange(eventList);
            }
        }

        var now = new Date().getTime();
        for (var n = 0; n < itemCount; ++n) {

            var event = eventList.data.items[n];
            if (!event.start || !event.start.dateTime) {
                console.log('No start time - ' + event.summary);
                continue;
            }
            if (!event.end || !event.end.dateTime) {
                console.log('No end time - ' + event.summary);
                continue;
            }
            var start = new Date(event.start.dateTime).getTime();
            start -= (config.extraStartTime * 1000);
            var end = new Date(event.end.dateTime).getTime();
            end += (config.extraEndTime * 1000);

            var eventIsHappening = false;
            if (now >= start && now <= end) {
                eventIsHappening = true;
            }

            if (!currentEvents[event.id] && eventIsHappening) {
                // The event isn't listed as current, so lets check to see if it is happening now!

                currentEvents[event.id] = event;
                if (onEventStart) {
                    onEventStart(event);
                }
            }
            else if (currentEvents[event.id] && !eventIsHappening) {
                // The event is listed as current, so let's check to see if it moved or is over
                if (onEventEnd) {
                    onEventEnd(event);
                }
                delete currentEvents[event.id];
            }
        }

        // There's one more way an event can end, if it was just deleted from the calendar. 
        for (var eventId in currentEvents) {

            var found = false;
            for (var n = 0; n < itemCount; ++n) {
                var event = eventList.data.items[n];
                if (event.id === eventId) {
                    found = true;
                    break;
                }
            }

            if (found === false) {
                if (onEventEnd) {
                    onEventEnd(currentEvents[eventId]);
                }
                delete currentEvents[eventId];
            }
        }


    } catch (err) {
        console.log('Exception in getEventsAsync -' + err.message);
    }
}

// 
// getEvents() - calls the asynchronouse getEventsAsync from a normal function
//
function getEvents() {
    (async () => {
        await getEventsAsync();
    })();
}


function start(scheduleChangeCallback, onStartCallback, onEndCallback) {

    onScheduleChange = scheduleChangeCallback;
    if (!onScheduleChange) {
        console.log('WARNING - events.js would be more useful if there was a handler for schedule change events');
    }

    onEventStart = onStartCallback;
    onEventEnd = onEndCallback;

    // Call it once to get the latest schedule upon startup
    getEvents();

    // Set an interval to check the schedule every 15 seconds
    let checkDelay = 15000;
    if (config.checkDelay && config.checkDelay > 5) {
        checkDelay = config.checkDelay * 1000;
    }
    setInterval(getEvents, checkDelay);
}

if (!module.exports.Start) {
    module.exports.Start = start;
    module.exports.EventList = eventList;
}

