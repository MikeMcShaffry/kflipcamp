//
// library.js - Open and search a SQLLite database used by MediaMonkey
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//   NOTE: COPYRIGHT will be assigned to KFLIPCAMP as soon as the legal entity is created! 
//
// The source code contained herein is open source under the MIT licence

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

const fs = require('fs');

const databaseFile = './data/MM5.DB';
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
            console.log(`WARNING - library - database file does not exist - file: ${databaseFile}`);
            return Promise.resolve(); // Explicitly return resolved promise
        }

        mmDb = await open({
            filename: databaseFile,
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READONLY
        });
        console.log('INFO - library - database file is open');
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
    let results = "";
    
    if (!artist) {
        console.log('WARNING - library - SearchByArtist called with empty artist');
        return results;
    }

    if (!mmDb) {
        console.log('WARNING - library - SearchByArtist called but database not available');
        results = "Sorry - search isn't available at the moment."
        return results;
    }

    try {
        // Do NOT ever forget to use LIMIT on these queries!
        let byArtist = `SELECT Artist, Album from Albums WHERE Artist LIKE ? ORDER BY Artist COLLATE NOCASE, Album COLLATE NOCASE LIMIT 50`;
        let qArtist = '%' + artist + '%';
        results = await mmDb.all(byArtist, [qArtist]);
        return results;
    }
    catch (err) {
        console.log(`ERROR - library - exception in SearchByArtist: ${err.message}`);
        results = "Sorry - an error occurred while searching the library."
        return results; // Return empty results instead of calling res.end
    }
}

if (!module.exports.Start) {
    module.exports.Start = Start;
    module.exports.SearchByArtist = SearchByArtist;
}
