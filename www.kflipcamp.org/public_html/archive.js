//
// archive.js - Create mp3 recordings of the station broadcasts and save them to S3
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT license, with the EXCEPTION of embedded passwords and authentication keys.
//
// DEPENDENCIES:
//   - You must have AWS CLI installed on the server and have it configured to allow copying to the S3 bucket
//   - You must have ffmpeg installed on the server
//


const spawn = require('child_process').spawn;
const os = require('os');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const handlebars = require('handlebars');

let eventProcesses = {};

const archiveConfig = require('./config.json').archive;


const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
];

let eventDetails = "";
let eventHappeningNow = false;

function onStartEvent(event) {

    console.log(`Starting event ${event.id}:${event.summary}`);

    if (!archiveConfig.enabled) {
        return;
    }

    eventDetails = "\n---------------------------------------\n   Playlist:\n";
    eventHappeningNow = true;

    if (eventProcesses[event.id]) {
        console.log(`Event ${event.id} already exists - killing the old one`);

        if (os.platform() !== 'win32') {
            eventProcesses[event.id].kill();
        }
    }



    let filename = `${archiveConfig.tmpDir}${event.id}.mp3`;
    if (fs.existsSync(filename)) {
        // Looks like the server restarted while I recording was happening! Lets save what we have.
        finalizeRecording(event);
    }

    if (os.platform() === 'win32') {
        console.log(`(skipped) /bin/ffmpeg -nostdin -hide_banner -nostats -loglevel panic -y -i ${archiveConfig.recordMount} ${filename}`);
        eventProcesses[event.id] = event;
        return;
    }

    let script = spawn('/bin/ffmpeg', ['-nostdin', '-hide_banner', '-nostats', '-loglevel', 'panic', '-y', '-i', archiveConfig.recordMount, filename]);
    script.stdout.on('data', (data) => {

        // data is a Buffer
        // log a conversion to a string that is one less byte
        // this is drop the line feed.
        console.log('ffmpeg stdout ' + data);
    });
    script.stderr.on('data', (data) => {

        // data is a Buffer
        // log a conversion to a string that is one less byte
        // this is drop the line feed.
        console.log('ffmpeg sterr: ' + data);
    });

    eventProcesses[event.id] = script;
}

//
// This renames the event recording to the summary text of the event, plus a tag the seconds from midnight
//   to keep multiple recording of the same event (perhaps the service was restarted or an event was moved)
//   from overwriting each other
//
function finalizeRecording(event) {
    let now = new Date();
    const month = monthNames[now.getMonth()];
    const day = now.getDate();
    const year = now.getFullYear();
    let datestamp = `${month}-${day}`;
    const archiveUrl = `${archiveConfig.url}/${year}`;

    const seconds = now.getHours() * 3600 + now.getMinutes();

    if (os.platform() === 'win32') {
        console.log(`(skipped) /bin/mv ${archiveConfig.tmpDir}${event.id}.mp3 ${archiveConfig.tmpDir}${datestamp}-${event.summary}-${seconds}.mp3`);
    }
    else {
        fs.renameSync(`${archiveConfig.tmpDir}${event.id}.mp3`, `${archiveConfig.tmpDir}${datestamp}-${event.summary}-${seconds}.mp3`);
    }

    const link = encodeURI(`${archiveUrl}/${datestamp}-${event.summary}-${seconds}.mp3`);

    eventDetails += `\n   Event recording stored in ${link}\n`

    console.log(eventDetails);
}

//
// An event ended, was deleted, or moved and we should save the recording
//
function onEndEvent(event) {

    console.log(`Ending event ${event.id}:${event.summary}`);

    if (!archiveConfig.enabled) {
        return;
    }

    if (!eventProcesses[event.id]) {
        console.log(`Event ${event.id} ended but recording process doesn't exist anymore.`);
        return;
    }

    if (os.platform() !== 'win32') {
        eventProcesses[event.id].kill();
    }
    delete eventProcesses[event.id];

    finalizeRecording(event);
}

function addToLog(detail) {
    if (eventHappeningNow && archiveConfig.enabled) {
        eventDetails += `   ${detail}\n`;
    }
}


async function start() {
    if (archiveConfig.enabled) {
        var source = await readFile('scripts/archive.sh.erb', 'utf8');
        var template = handlebars.compile(source);
        var archiveScript = template(archiveConfig);
        await writeFile('scripts/archive.sh', archiveScript);
        fs.chmodSync('scripts/archive.sh', '0770');
    }
}



if (!module.exports.Start) {
    module.exports.Start = start;
    module.exports.OnStartEvent = onStartEvent;
    module.exports.OnEndEvent = onEndEvent;
    module.exports.AddToLog = addToLog;
}

