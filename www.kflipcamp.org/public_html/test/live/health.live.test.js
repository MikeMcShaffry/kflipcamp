const expect = require('expect.js');

// Live tests are opt-in and should be run explicitly (see scripts/run-tests.ps1 -Live)
// Requires: KFLIP_BASE_URL

const http = require('http');
const https = require('https');

function getJson(url, timeoutMs) {
  return new Promise((resolve, reject) => {
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const req = lib.request(
      {
        method: 'GET',
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'kflipcamp-live-tests',
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = JSON.parse(body);
          } catch (e) {
            // leave json as null
          }
          resolve({ statusCode: res.statusCode, body, json });
        });
      }
    );

    req.on('error', reject);
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error('Request timeout'));
    });

    req.end();
  });
}

describe('live: /health', function () {
  // Keep live tests snappy.
  this.timeout(8000);

  it('returns ok from live server', async function () {
    const baseUrl = process.env.KFLIP_BASE_URL;
    expect(baseUrl, 'KFLIP_BASE_URL must be set').to.be.ok();

    const url = new URL('/health', baseUrl);

    const res = await getJson(url, 5000);
    expect(res.statusCode).to.be(200);

    expect(res.json, 'Expected JSON response, got: ' + res.body).to.be.ok();
    expect(res.json).to.have.property('status', 'ok');
  });
});
