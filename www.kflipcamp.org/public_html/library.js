//
// library.js - Open and search a SQLLite database used by MediaMonkey
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT licence

const sqlite = require('sqlite-async');
const fs = require('fs');

const databaseFile = './data/MM.DB';
let mmDb = null;

//
// Start - opens the MediaMonkey database file
//
async function Start() {

    if (fs.existsSync(databaseFile) == false) {
        console.log('WARNING - library - database file does not exist - find the MediaMonkey MM.DB file in AppData/Roaming/MediaMonkey and copy it to a data directory to enable searching');
        return;
    }

    sqlite.open(databaseFile).then(_db => {
        mmDb = _db
        console.log('INFO - library - connected to the MM.DB database.');
    });
}

//
// SearchByArtist - searches the database for an artist
//
async function SearchByArtist(artist) {
    let results = [];
    if (!mmDb || !artist) {
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
        console.log(`ERROR - library - exception in library SearchByArtist - ${err.message}`);
        res.end(JSON.stringify(results));
    }
}

if (!module.exports.Start) {
    module.exports.Start = Start;
    module.exports.SearchByArtist = SearchByArtist;
}
