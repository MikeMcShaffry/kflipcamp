//
// patreon.js - Manages OAuth 2.0 authentication with Patreon to unlock special site features!
//
// COPYRIGHT (c) 2020 by Michael L. McShaffry - All rights reserved
//   NOTE: COPYRIGHT will be assigned to KFLIPCAMP as soon as the legal entity is created! 
//
// The source code contained herein is open source under the MIT licence

const site_url = require("./config.json").studio.site_url;
const config =  require("./config.json").patreon;
const passport = require('passport');


const PatreonStrategy = require('passport-patreon').Strategy;

let Patreons = {};  // a dictionary of Patreon supporters by id

passport.use(new PatreonStrategy(
    {
        clientID: config.auth.clientID,
        clientSecret: config.auth.clientSecret,
        callbackURL: "http://localhost:3000/oauth/callback",
        scope: "users"
    },
    (accessToken, refreshToken, profile, cb) => {
        Patreons[profile.id] = profile;
        console.log(`INFO - patreon - user verified: ${profile.Name}`);
        return cb(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
})

passport.deserializeUser(function(obj, done) {
    done(null, obj);
})

function ConfigureApp(app) {
    app.use(passport.initialize());
    app.use(passport.session());
}


if (!module.exports.ConfigureApp) {
    module.exports.ConfigureApp = ConfigureApp;
    module.exports.passport = passport;
}
