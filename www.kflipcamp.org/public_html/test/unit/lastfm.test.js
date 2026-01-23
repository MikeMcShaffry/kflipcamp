const expect = require('expect.js');

const lastfm = require('../../lastfm');

// Helper: create a fake http.get that immediately returns a response with given body.
function makeFakeHttpGet(body, { statusCode = 200 } = {}) {
  return function fakeGet(url, cb) {
    const handlers = {};

    const res = {
      statusCode,
      on: function (event, handler) {
        handlers[event] = handler;
        return res;
      },
    };

    // invoke callback immediately
    cb(res);

    // simulate streaming
    if (handlers.data) {
      handlers.data(Buffer.from(body, 'utf8'));
    }
    if (handlers.end) {
      handlers.end();
    }

    return {
      setTimeout: function () {},
      on: function () {},
      destroy: function () {},
    };
  };
}

describe('lastfm', function () {
  beforeEach(async function () {
    // Ensure module is initialized; callback optional.
    await lastfm.Start(function () {});
  });

  it('ParseLastFmAlbumInfo handles error payload by setting unknown', function () {
    lastfm.__test.ParseLastFmAlbumInfo(JSON.stringify({ error: 6, message: 'Album not found' }));

    expect(lastfm.AlbumSummary()).to.be('No album summary available.');
    expect(lastfm.AlbumImage()).to.be.ok();
  });

  it('ParseLastFmAlbumInfo prefers album payload and selects a non-empty image url', function () {
    const payload = {
      album: {
        wiki: { summary: 'hello world' },
        image: [
          { '#text': '', size: 'small' },
          { '#text': 'http://example.com/mega.jpg', size: 'mega' },
        ],
      },
    };

    lastfm.__test.ParseLastFmAlbumInfo(JSON.stringify(payload));

    expect(lastfm.AlbumSummary()).to.contain('hello world');
    expect(lastfm.AlbumImage()).to.be('http://example.com/mega.jpg');
  });

  it('UpdateNowPlaying parses "Artist - Track off *Album*" and calls LastFM with album.getinfo', async function () {
    // Enable lastfm for this test. We keep this localized.
    lastfm.__test.setEnabled(true);

    // Monkey patch the internal http module used by lastfm.
    lastfm.__test.setHttpGet(
      makeFakeHttpGet(
        JSON.stringify({
          album: {
            wiki: { summary: 'summary' },
            image: [{ '#text': 'http://example.com/x.jpg', size: 'mega' }],
          },
        })
      )
    );

    await lastfm.UpdateNowPlaying('The Beatles - All Together Now off *Yellow Submarine*');

    expect(lastfm.AlbumSummary()).to.contain('summary');
    expect(lastfm.AlbumImage()).to.be('http://example.com/x.jpg');
  });
});

