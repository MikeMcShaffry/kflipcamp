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
const OAuth2Strategy = require('passport-oauth2').Strategy;

let Patreons = {};  // a dictionary of Patreon supporters by id

// Create a custom Patreon strategy using OAuth2Strategy as base
const PatreonStrategy = new OAuth2Strategy(
    {
        authorizationURL: 'https://www.patreon.com/oauth2/authorize',
        tokenURL: 'https://www.patreon.com/api/oauth2/token',
        clientID: config.auth.clientID,
        clientSecret: config.auth.clientSecret,
        callbackURL: config.auth.callbackUrl,
        scope: ['identity', 'identity[email]']
    },
    async (accessToken, refreshToken, profile, cb) => {
        try {
            // Fetch user profile from Patreon API v2
            const https = require('https');
            const options = {
                hostname: 'www.patreon.com',
                path: '/api/oauth2/v2/identity?fields[user]=email,full_name,image_url',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'User-Agent': 'kflipcamp-app'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    try {
                        console.log(`INFO - patreon - Raw API response:`, data);
                        const json = JSON.parse(data);
                        
                        // Patreon API v2 uses JSON:API format
                        if (json.data && json.data.attributes) {
                            const userId = json.data.id;
                            const userName = json.data.attributes.full_name || json.data.attributes.email || 'Unknown';
                            const userAvatar = json.data.attributes.image_url || '';
                            
                            Patreons[userId] = {
                                id: userId,
                                name: userName,
                                avatar: userAvatar,
                                rawProfile: json.data
                            };
                            
                            console.log(`INFO - patreon - user verified: ${userName}`);
                            return cb(null, Patreons[userId]);
                        } else {
                            console.error(`ERROR - patreon - Unexpected API response format:`, json);
                            return cb(new Error('Unexpected API response format'), null);
                        }
                    } catch (parseError) {
                        console.error(`ERROR - patreon - Failed to parse API response:`, parseError);
                        return cb(parseError, null);
                    }
                });
            });

            req.on('error', (error) => {
                console.error(`ERROR - patreon - Failed to fetch user profile:`, error);
                return cb(error, null);
            });

            req.end();
            
        } catch (error) {
            console.error(`ERROR - patreon - Failed to process authentication:`, error);
            return cb(error, null);
        }
    }
);

passport.use('patreon', PatreonStrategy);

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
