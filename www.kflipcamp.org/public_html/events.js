//
// events.js - Grabs a google calenadar and emits events to connected browsers
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT licence, with the EXCEPTION of embedded passwords and authentication keys.



const { google } = require('googleapis');
const cal = google.calendar({
    version: 'v3',
    auth: 'AIzaSyD8q-Cjvq1lid62vUbdp2VEiv5yL1gObio'                              // TODO CONFIGURATION - this auth key should be in a configuration file somewhere
});

// Set the calendar to query -                 
const calendar = 'q6gr9cqtbf3lb5q1nqaj4c0ca8@group.calendar.google.com';        // TODO CONFIGURATION - this calendar endpoint should be in a configuration file somewhere


async function getEventList() {

    // Set beginning of query to yesterday
    let startDate = new Date();

    let list = await cal.events.list({
        // Set times to ISO strings as such
        timeMin: new Date(startDate).toISOString(),
        calendarId: calendar
    });

    list.data.items.forEach(function(event) {
        event.startDate = new Date(event.start.dateTime);
    });

    let sortedItems = list.data.items.sort(function (a, b) { return a.startDate - b.startDate; });
    list.data.items = sortedItems;
    return list;
}


// Variables that hold calendar information
let EventList = null;                               // an array of scheduled events
let onScheduleChange = null;                        // a callback function to handle schedule changes
let lastScheduleSentWasUpdated = null;              // the date of the last schedule change (stored at Google calendar)
let lastScheduleItemCount = 0;                      // the number of scheduled events

//
// getEventsAsync() -  Grab the KFLIP calendar and if there are any changes, emit them to any connected browsers
//
async function getEventsAsync() {

    try {
        EventList = await getEventList();
        const currentUpdated = new Date(EventList.data.updated);
        const itemCount = EventList.data.items.length;

        if (!lastScheduleSentWasUpdated ||
            lastScheduleSentWasUpdated < currentUpdated ||
            lastScheduleItemCount != itemCount) {
            //if (true) {
            console.log('A new schedule for everyone! Sending the latest schedule with ' +
                EventList.data.items.length +
                ' events');
            lastScheduleSentWasUpdated = currentUpdated;
            lastScheduleItemCount = itemCount;

            if (onScheduleChange) {
                onScheduleChange(EventList);
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


function Start(scheduleChangeHandler) {

    onScheduleChange = scheduleChangeHandler;
    if (!onScheduleChange) {
        console.log('WARNING - events.js would be more useful if there was a handler for schedule change events');
    }

    // Call it once to get the latest schedule upon startup
    getEvents();

    // Set an interval to check the schedule every 15 seconds
    setInterval(getEvents, 15000);                   // TODO CONFIGURATION - add the TTL of the scehdule to the configuration file
}

if (!module.exports.Start) {
    module.exports.Start = Start;
    module.exports.EventList = EventList;
}

