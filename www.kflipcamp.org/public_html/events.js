//
// events.js - Grabs a google calenadar and emits events to connected browsers
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//   NOTE: COPYRIGHT will be assigned to KFLIPCAMP as soon as the legal entity is created! 
//
// The source code contained herein is open source under the MIT licence, with the EXCEPTION of embedded passwords and authentication keys.

// Here we load the config.json file that contains our token and our prefix values. 

const config = require("./config.json").googlecalendar;			// <<<<<<< I added a google calendar section to the config file
const { google } = require('googleapis');

let knownBadEvents = {}

const auth = new google.auth.GoogleAuth({
    keyFile: config.auth_keyfile,
    scopes: ['https://www.googleapis.com/auth/calendar']
});

const cal = google.calendar({
    version: 'v3',
    auth: auth
});

class BadEventError extends Error {
    constructor(message, event) {
        super(message);
        this.name = "BadEventError";
        this.event = event;
    }
}


function checkIfBadEventsAreFixed(sortedEvents)
{
    try {
        Object.keys(knownBadEvents).forEach(function (key) {
            let badEventIsGone = true;
            sortedEvents.forEach((event) => {
                if (event.id === key) {
                    badEventIsGone = false;
                }
            });

            if (badEventIsGone) {
                if (addToEngineeringLog) {
                    addToEngineeringLog("INFO - A bad event has been fixed")
                }
                delete knownBadEvents[key];
            }
        })
    }
    catch(error) {
        console.log(`ERROR - events - checkIfBadEventsAreFixed - ${error.message}`)
    }
}

async function getEventList() {
    try {
        // Set beginning of query to now minus six hours - longer than our longest show)
        let startDate = new Date().getTime() - (6 * 60 * 60 * 1000);
        
        let list = await cal.events.list({
            timeMin: new Date(startDate).toISOString(),
            calendarId: config.calendarId
        });

        // process the return list by converting dates, checking for repeating shows (they don't work!)
        let processedList = [];
        list.data.items.forEach(function (event) {
            try {
                if (event.recurrence) {
                    throw new BadEventError("Recurring event detected", event);
                } else if (event.start && event.start.dateTime) {
                    event.startDate = new Date(event.start.dateTime);
                    processedList.push(event);
                }
            }
            catch (error) {
                if (error instanceof BadEventError) {
                    if (!knownBadEvents[error.event.id]) {
                        knownBadEvents[error.event.id] = error.event;
                        if (error.event) {
                            if (error.event.summary) {
                                error.message += ` - Summary: ${error.event.summary}`;
                            }
                            if (error.event.creator && error.event.creator.email) {
                                error.message += ` - Created By: ${error.event.creator.email}`;
                            }
                            if (error.event.start && error.event.start.dateTime) {
                                error.message += ` - Starting: ${error.event.start.dateTime}`
                            }
                            if (error.event.htmlLink) {
                                error.message += ` - ${error.event.htmlLink}`
                            }
                        }
                        console.log(`ERROR - events - Invalid event in calendar - ${error.message}`)
                        if (addToEngineeringLog) {
                            addToEngineeringLog(`ERROR - events - Invalid event in calendar - ${error.message}`)
                        }
                    }
                }
                else {
                    console.log(`ERROR - events - Exception in getEventList - ${error.message}`);
                }
            }            
        });
        
        let sortedItems = processedList.sort(function (a, b) {
            return a.startDate - b.startDate;
        });
        checkIfBadEventsAreFixed(list.data.items);
        list.data.items = sortedItems;
        return list;
    }
    catch (error) {
        console.log(`ERROR - events - Exception in getEventList - ${error.message}`);
    }
}

async function getEventsByDate(startISOString, endISOString) {

    try {
        // Set beginning of query to now minus three hours - a typical long show)
        let list = await cal.events.list({
            // Set times to ISO strings as such
            timeMin: startISOString,
            timeMax: endISOString,
            calendarId: config.calendarId
        });

        list.data.items.forEach(function (event) {
            event.startDate = new Date(event.start.dateTime);
        });

        list.data.items = list.data.items.sort(function (a, b) {
            return a.startDate - b.startDate;
        });
        return list;
    }
    catch(error) {
        console.log(`ERROR - events - Exception in getEventsByDate - ${error.message}`);
    }
    return [];
}


async function getEvent(id) {
    return await cal.events.get({
        calendarId: config.calendarId,
        eventId: id,
        auth: auth
    });
}

async function updateEventDescription(event) {
    try {
        await cal.events.patch({
            calendarId: config.calendarId,
            eventId: event.data.id,
            requestBody: { description: event.data.description },
            auth: auth
        });
        console.log('INFO - events - event updated - ' + event.data.summary);
    } catch (err) {
        console.log('ERROR - events - exception in updateEventDescription -' + err.message);
    }
}


// Variables that hold calendar information
let eventList = null;                               // an array of scheduled events
let onScheduleChange = null;                        // a callback function to handle schedule changes
let lastScheduleSentWasUpdated = null;              // the date of the last schedule change (stored at Google calendar)
let lastScheduleItemCount = 0;                      // the number of scheduled events

let currentEvents = {};                             // events where the start and end times are withing the buffer time

let onEventStart = null;                            // callback for event start
let onEventEnd = null;                              // callback for event end
let addToEngineeringLog = null;                     // callback for reporting something important to the engineering log)

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
            console.log('INFO - events - a calendar has an update - sending ' +
                eventList.data.items.length +
                ' events');
            lastScheduleSentWasUpdated = currentUpdated;
            lastScheduleItemCount = itemCount;

            if (onScheduleChange) {
                onScheduleChange(config.calendarId, eventList);
            }
        }

        var now = new Date().getTime();
        for (let n = 0; n < itemCount; ++n) {

            let event = eventList.data.items[n];
            if (!event.start || !event.start.dateTime) {
                console.log('WARNING - events - missing start time - ' + event.summary);
                continue;
            }
            if (!event.end || !event.end.dateTime) {
                console.log('WARNING - events - missing end time - ' + event.summary);
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
                    await onEventStart(event);
                }
            }
            else if (currentEvents[event.id] && !eventIsHappening) {
                // The event is listed as current, so let's check to see if it moved or is over
                if (onEventEnd) {
                    await onEventEnd(event);
                }
                delete currentEvents[event.id];
            }
        }

        let eventIds = Object.keys(currentEvents);
        // There's one more way an event can end, if it was just deleted from the calendar. 
        for (let m=0; m < eventIds.length; ++m) {

            let eventId = eventIds[m];
            let found = false;
            for (let n = 0; n < itemCount; ++n) {
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
        console.log('ERROR - events - exception in getEventsAsync -' + err.message);
    }
}

// 
// getEvents() - calls the asynchronous getEventsAsync from a normal function
//
function getEvents() {
    // TODO - this should be converted to the .then().catch() syntax
    (async () => {
        await getEventsAsync();
    })();
}


async function addDetails(id, details) {
    let event = await getEvent(id);

    if (!event.data.description) {
        event.data.description = details;
    } else {
        event.data.description += details;
    }

    await updateEventDescription(event);
}


function start(scheduleChangeCallback, onStartCallback, onEndCallback, addToEngineeringLogCallback) {

    onScheduleChange = scheduleChangeCallback;
    if (!onScheduleChange) {
        console.log('WARNING - events - this module has no onScheduleChange handler');
    }

    onEventStart = onStartCallback;
    onEventEnd = onEndCallback;
    addToEngineeringLog = addToEngineeringLogCallback

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
    module.exports.GetEventDescription = getEvent;
    module.exports.UpdateEventDescription = updateEventDescription;
    module.exports.AddDetails = addDetails;
    module.exports.GetEventsByDate = getEventsByDate;
}

