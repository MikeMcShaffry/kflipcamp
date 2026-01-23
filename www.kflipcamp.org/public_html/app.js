//
// app.js - Express app factory for tests and (optionally) production
//
// This exists so integration tests can create an app instance without
// implicitly starting the HTTP server or background modules.
//

const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

function createApp(options) {
  const opts = options || {};

  const config = opts.config || require('./config.json').studio;
  const sessionSecret = opts.sessionSecret || require('./config.json').session_secret;

  const library = opts.library || require('./library.js');
  const events = opts.events || require('./events.js');
  const lastfm = opts.lastfm || require('./lastfm.js');

  const patreon = opts.patreon || null;

  // Allow tests to set state while index.js can keep these state vars updated.
  const state = opts.state || { streamInfo: null };

  const app = express();

  // Static
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/js', express.static(path.join(__dirname, 'public/js')));

  // Body/session
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());

  app.use(
    session({
      secret: sessionSecret,
      resave: false,
      saveUninitialized: true,
    })
  );

  // Simple health check that bypasses Patreon/passport middleware
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  });

  // Optional Patreon wiring (production). Keep this after /health so health bypasses it.
  if (patreon && typeof patreon.ConfigureApp === 'function') {
    patreon.ConfigureApp(app);

    // Auth routes (match index.js behavior)
    if (patreon.passport) {
      app.get(
        '/auth/patreon',
        patreon.passport.authenticate('patreon', {
          successReturnToOrRedirect: '/',
        })
      );

      app.get(
        '/oauth/callback',
        patreon.passport.authenticate('patreon', {
          callback: true,
          successReturnToOrRedirect: '/',
          failureRedirect: '/',
        })
      );
    }

    app.get('/auth/user', function (req, res) {
      console.log('INFO - GET /auth/user');
      if (req.isAuthenticated()) {
        console.log(`INFO - /auth/user sees ${req.user.name}`);
        res.status(200).json({ supporter: true, name: req.user.name, avatar: req.user.avatar });
      } else {
        console.log('INFO - /auth/user sees an unauthenticated listener');
        res.status(200).json({ supporter: false });
      }
    });
  }

  // nowplaying endpoints are stateful; allow tests to inject state.
  app.get('/nowplaying/title', async function (req, res) {
    try {
      res.set('Content-Type', 'text/html');
      res.end(state.streamInfo && state.streamInfo.title ? state.streamInfo.title : '');
    } catch (err) {
      console.log('ERROR - GET /nowplaying/title: ' + err.message);
      res.status(500).end('Internal server error');
    }
  });

  app.get('/nowplaying/albumimage', async function (req, res) {
    try {
      res.set('Content-Type', 'text/html');

      let imageUrl = '';
      if (lastfm && lastfm.AlbumImage) {
        imageUrl = lastfm.AlbumImage;
        if (typeof imageUrl === 'string' && imageUrl.startsWith('http://')) {
          imageUrl = imageUrl.replace('http://', 'https://');
        }
      }

      res.end(imageUrl || '');
    } catch (err) {
      console.log('ERROR - GET /nowplaying/albumimage: ' + err.message);
      res.status(500).end('Internal server error');
    }
  });

  app.get('/nowplaying/albumsummary', async function (req, res) {
    try {
      res.set('Content-Type', 'application/json');

      if (!lastfm.Enabled || !lastfm.AlbumSummary) {
        return res.status(200).json({ summary: null });
      }

      res.json({ summary: lastfm.AlbumSummary });
    } catch (err) {
      console.log('ERROR - GET /nowplaying/albumsummary: ' + err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/search', async function (req, res) {
    let results = [];
    try {
      if (req.query.by === 'artist') {
        const artist = req.query.param;
        results = await library.SearchByArtist(artist);
      }
    } catch (err) {
      console.log('ERROR - POST /search: ' + err.message);
      return res.status(500).json({ error: 'Search failed' });
    }

    res.end(JSON.stringify(results));
  });

  app.get('/archive/:start/:end', async function (req, res) {
    let results = [];
    try {
      if (
        moment(req.params.start, moment.ISO_8601).isValid() === false ||
        moment(req.params.end, moment.ISO_8601).isValid() === false
      ) {
        return res.status(400).send({ message: 'Invalid parameters' });
      }
      results = await events.GetEventsByDate(req.params.start, req.params.end);
    } catch (err) {
      console.log('ERROR - GET /archive/:start/:end - ' + err.message);
    }

    res.end(JSON.stringify(results));
  });

  // 404 + error handler (match index.js behavior)
  app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // eslint-disable-next-line no-unused-vars
  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500).send(err.message);
  });

  return {
    app,
    state,
    config,
    setStreamInfo: function (streamInfo) {
      state.streamInfo = streamInfo;
    },
  };
}

module.exports = { createApp };
