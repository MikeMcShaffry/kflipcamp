//
// postinstall.js - Runs any post installation tasks, such as creating the archive script
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//
// The source code contained herein is open source under the MIT license, with the EXCEPTION of embedded passwords and authentication keys.


const archive = require('./archive.js');

//
// Calls all post install scripts
//
function postInstall() {
    (async () => {

        await archive.PostInstall();
    })();
}

postInstall();


//
// Avoids the process shutting down due to an unhandled promise rejection or unhandled exceptions
//
process.on('unhandledRejection', error => {
    console.log('unhandledRejection', error);
});


process.on('uncaughtException', error => {
    console.log('unchaughtException ', error);
});




