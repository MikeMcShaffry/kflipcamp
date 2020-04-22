const { google } = require('googleapis');
const cal = google.calendar({
    version: 'v3',
    auth: 'AIzaSyD8q-Cjvq1lid62vUbdp2VEiv5yL1gObio'
});

// Set the calendar to query
const calendar = 'q6gr9cqtbf3lb5q1nqaj4c0ca8@group.calendar.google.com';


async function get() {

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

module.exports.get = get;

// JavaScript source code
