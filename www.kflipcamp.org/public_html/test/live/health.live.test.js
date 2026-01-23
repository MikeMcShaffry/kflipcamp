const expect = require('expect.js');

// Live tests are opt-in and should be run explicitly (see scripts/run-tests.ps1 -Live)
// Requires: KFLIP_BASE_URL

describe('live: /health', function () {
  it('returns ok from live server', async function () {
    const baseUrl = process.env.KFLIP_BASE_URL;
    expect(baseUrl).to.be.ok();

    const url = new URL('/health', baseUrl);

    const res = await fetch(url.toString(), { method: 'GET' });
    expect(res.status).to.be(200);

    const json = await res.json();
    expect(json).to.have.property('status', 'ok');
  });
});

