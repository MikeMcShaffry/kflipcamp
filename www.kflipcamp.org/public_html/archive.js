//
// archive.js - Create mp3 recordings of the station broadcasts and save them to S3
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//   NOTE: COPYRIGHT will be assigned to KFLIPCAMP as soon as the legal entity is created!
//
// The source code contained herein is open source under the MIT license, with the EXCEPTION of embedded passwords and authentication keys.
//
// DEPENDENCIES:
//   - You must have AWS CLI installed on the server and have it configured to allow copying to the S3 bucket
//   - You must have ffmpeg installed on the server
//
// OTHER NOTES:
//
//   - scripts/kflip_cron is a cronjob that runs every five minutes to copy the recorded MP3 files up to the S3 bucket
//   - scripts.postinstall.sh  - runs after the app is installed to start the service and install kflip_cron


const spawn = require('child_process').spawn;
const os = require('os');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const handlebars = require('handlebars');

let eventProcesses = {};
let eventDetails = {};
let addDetails = null;

const archiveConfig = require('./config.json').archive;


const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
];

const divider = '\n---------------------------------------\n';

async function onStartEvent(event) {

    console.log(`INFO - archive - starting event ${event.id}:${event.summary}`);

    if (!archiveConfig.enabled) {
        return;
    }

    let existing = '';
    if (eventDetails[event.id]) {
        existing = eventDetails[event.id];
    }
    eventDetails[event.id] = `${existing}\n---------------------------------------\n   Playlist:\n`;

    if (eventProcesses[event.id]) {
        console.log(`WARNING - archive - event ${event.id} already exists - killing the old one`);

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
        console.log(`INFO - archive - (skipped) /bin/ffmpeg -nostdin -hide_banner -nostats -loglevel panic -y -i ${archiveConfig.recordMount} ${filename}`);
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
// finalizeRecording renames the event recording to the summary text of the event, plus a tag the seconds from midnight
//   to keep multiple recording of the same event (perhaps the service was restarted or an event was moved)
//   from overwriting each other
//
async function finalizeRecording(event) {
    
    try {
        const now = new Date();
        const month = monthNames[now.getMonth()];
        const day = now.getDate();
        const year = now.getFullYear();
        const datestamp = `${month}-${day}`;
        const archiveUrl = `${archiveConfig.url}${year}`;

        const seconds = now.getHours() * 3600 + now.getMinutes();

        if (os.platform() === 'win32') {
            console.log(`INFO - archive - (skipped) /bin/mv ${archiveConfig.tmpDir}${event.id}.mp3 ${archiveConfig.tmpDir}${datestamp}-${event.summary}-${seconds}.mp3`);
        } else {
            fs.renameSync(`${archiveConfig.tmpDir}${event.id}.mp3`, `${archiveConfig.tmpDir}${datestamp}-${event.summary}-${seconds}.mp3`);
        }

        const link = encodeURI(`${archiveUrl}/${datestamp}-${event.summary}-${seconds}.mp3`);

        eventDetails[event.id] = `${divider}Click here to listen to this show: ${link}\n${eventDetails[event.id]}`;
        if (addDetails) {
            await addDetails(event.id, eventDetails[event.id]);
        }

        console.log(eventDetails[event.id]);
    }
    catch (error) {
        console.log(`ERROR - archive - finalizeRecording - ${error.message}`);    
    }
}

//
// An event ended, was deleted, or moved and we should save the recording
//
async function onEndEvent(event) {

    console.log(`Ending event ${event.id}:${event.summary}`);

    if (!archiveConfig.enabled) {
        return;
    }

    if (!eventProcesses[event.id]) {
        console.log(`WARNING - archive - event ${event.id} ended but recording process doesn't exist anymore.`);
        return;
    }

    if (os.platform() !== 'win32') {
        eventProcesses[event.id].kill();
    }

    await finalizeRecording(event);

    delete eventProcesses[event.id];
    delete eventDetails[event.id];
}

function addToLog(detail) {
    if (archiveConfig.enabled) {

        let eventIds = Object.keys(eventDetails);
        for (let n = 0; n < eventIds.length; n++) {
            let eventId = eventIds[n];
            eventDetails[eventId] += `   - ${detail}\n`;
        }

    }
}


async function start(addDetailsCallback) {
    addDetails = addDetailsCallback;
}

async function postInstall() {
    if (archiveConfig.enabled) {
        var source = await readFile('scripts/archive.sh.erb', 'utf8');
        var template = handlebars.compile(source);
        var archiveScript = template(archiveConfig);
        await writeFile('scripts/archive.sh', archiveScript);
        fs.chmodSync('scripts/archive.sh', '0770');
        console.log('INFO - archive - postInstall has run');
    }
}



if (!module.exports.Start) {
    module.exports.Start = start;
    module.exports.PostInstall = postInstall;
    module.exports.OnStartEvent = onStartEvent;
    module.exports.OnEndEvent = onEndEvent;
    module.exports.AddToLog = addToLog;
}

