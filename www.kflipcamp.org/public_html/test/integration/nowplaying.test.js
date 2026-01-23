const expect = require('expect.js');
const request = require('supertest');

const { createApp } = require('../../app');

describe('integration: /nowplaying', function () {
  it('GET /nowplaying/title returns empty string when no streamInfo', async function () {
    const { app } = createApp({
      library: { SearchByArtist: async () => [] },
      events: { GetEventsByDate: async () => ({ data: { items: [] } }) },
      lastfm: { Enabled: false },
    });

    const res = await request(app).get('/nowplaying/title').expect(200);
    expect(res.text).to.be('');
  });

  it('GET /nowplaying/title returns title when streamInfo is set', async function () {
    const { app, setStreamInfo } = createApp({
      library: { SearchByArtist: async () => [] },
      events: { GetEventsByDate: async () => ({ data: { items: [] } }) },
      lastfm: { Enabled: false },
    });

    setStreamInfo({ title: 'Artist - Track - Album' });

    const res = await request(app).get('/nowplaying/title').expect(200);
    expect(res.text).to.be('Artist - Track - Album');
  });
});
