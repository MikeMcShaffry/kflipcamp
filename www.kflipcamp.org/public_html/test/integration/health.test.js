const expect = require('expect.js');
const request = require('supertest');

const { createApp } = require('../../app');

describe('integration: /health', function () {
  it('returns ok', async function () {
    const { app } = createApp({
      // keep deps minimal
      library: { SearchByArtist: async () => [] },
      events: { GetEventsByDate: async () => ({ data: { items: [] } }) },
      lastfm: { Enabled: false },
    });

    const res = await request(app).get('/health').expect(200);
    expect(res.body).to.have.property('status', 'ok');
    expect(res.body).to.have.property('timestamp');
  });
});

