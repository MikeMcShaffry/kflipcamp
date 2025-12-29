//
// library.js - Open and search a SQLLite database used by MediaMonkey
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//   NOTE: COPYRIGHT will be assigned to KFLIPCAMP as soon as the legal entity is created! 
//
// The source code contained herein is open source under the MIT licence

//const sqlite = require('sqlite-async');
const fs = require('fs');

const databaseFile = './data/MM.DB';
let mmDb = null;

//
// Start - opens the MediaMonkey database file
//
async function Start() {
    try {
        // Create data directory if it doesn't exist
        const dataDir = './data';
        if (!fs.existsSync(dataDir)) {
            console.log('INFO - library - creating data directory');
            fs.mkdirSync(dataDir, { recursive: true });
        }

        if (!fs.existsSync(databaseFile)) {
            console.log('WARNING - library - database file does not exist - find the MediaMonkey MM.DB file in AppData/Roaming/MediaMonkey and copy it to a data directory to enable searching');
            console.log('INFO - library - continuing without database functionality');
            return Promise.resolve(); // Explicitly return resolved promise
        }

        // Database connection code is commented out, so just return success
        console.log('INFO - library - database file exists but connection is disabled');
        return Promise.resolve();

        //    sqlite.open(databaseFile).then(_db => {
        //        mmDb = _db
        //        console.log('INFO - library - connected to the MM.DB database.');
        //    });
    } catch (err) {
        console.log('ERROR - library - exception in Start:', err.message);
        // Don't throw the error, just log it and continue
        return Promise.resolve();
    }
}

//
// SearchByArtist - searches the database for an artist
//
async function SearchByArtist(artist) {
    let results = [];
    
    if (!artist) {
        console.log('WARNING - library - SearchByArtist called with empty artist');
        return results;
    }

    if (!mmDb) {
        console.log('WARNING - library - SearchByArtist called but database not available');
        return results;
    }

    try {
        // Do NOT ever forget to use LIMIT on these queries!
        let byArtist = `SELECT SongTitle, Artist, Album, ID from Songs WHERE Artist LIKE ? LIMIT 20`;
        let qArtist = '%' + artist + '%';
        results = await mmDb.all(byArtist, [qArtist]);
        return results;
    }
    catch (err) {
        console.log(`ERROR - library - exception in SearchByArtist: ${err.message}`);
        return results; // Return empty results instead of calling res.end
    }
}

if (!module.exports.Start) {
    module.exports.Start = Start;
    module.exports.SearchByArtist = SearchByArtist;
}
