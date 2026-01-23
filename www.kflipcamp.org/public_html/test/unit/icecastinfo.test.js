const expect = require('expect.js');

// Note: these unit tests are written to be fast and deterministic.
// They do not make network calls.

const icecast = require('../../icecastinfo');

function buildIcecastJson({
  asArray = false,
  sources = [],
}) {
  const sourcePayload = asArray ? sources : sources[0];
  return JSON.stringify({
    icestats: {
      source: sourcePayload,
    },
  });
}

describe('icecastinfo', function () {
  describe('checkForSomethingNew (parsing + callbacks)', function () {
    beforeEach(function () {
      // Reset internal module state between tests by simulating a fresh 'dead air' parse.
      // (This keeps tests deterministic without requiring a full module reload.)
      try {
        icecast.__test.checkForSomethingNew(JSON.stringify({ icestats: { source: [] } }));
      } catch (_) {
        // ignore
      }
    });

    it('does not throw on malformed JSON and does not call callbacks', function () {
      let called = false;

      icecast.Start(
        function () {
          called = true;
        },
        function () {
          called = true;
        }
      );

      // malformed JSON
      icecast.__test.checkForSomethingNew('{ this is not json');
      expect(called).to.be(false);
    });

    it('handles icestats.source as a single object and emits nowplaying once a broadcasting stream is found', function () {
      let nowPlaying = null;
      let listeners = null;
      let streamChanged = null;

      icecast.Start(
        function (streamInfo, listenerCount, _streamChanged) {
          nowPlaying = streamInfo;
          listeners = listenerCount;
          streamChanged = _streamChanged;
        },
        function () {}
      );

      const json = buildIcecastJson({
        asArray: false,
        sources: [
          {
            listenurl: 'http://www.kflipcamp.org:8000/kflip',
            title: 'Artist - Track - Album',
            listeners: 12,
            audio_info: 'samplerate=44100',
          },
        ],
      });

      icecast.__test.checkForSomethingNew(json);

      expect(nowPlaying).to.be.ok();
      expect(nowPlaying.listenurl).to.be('http://www.kflipcamp.org:8000/kflip');
      expect(listeners).to.be(12);
      // First ever stream should be considered a "change".
      expect(streamChanged).to.be(true);
    });

    it('handles icestats.source as an array and picks the first stream with audio_info', function () {
      let nowPlaying = null;

      icecast.Start(
        function (streamInfo) {
          nowPlaying = streamInfo;
        },
        function () {}
      );

      const json = buildIcecastJson({
        asArray: true,
        sources: [
          {
            listenurl: 'http://www.kflipcamp.org:8000/kflip_auto',
            title: 'No audio info here',
            listeners: 0,
            audio_info: null
          },
          {
            listenurl: 'http://www.kflipcamp.org:8000/kflip',
            title: 'Artist - Track - Album',
            listeners: 3,
            audio_info: 'samplerate=44100',
          },
        ],
      });

      icecast.__test.checkForSomethingNew(json);

      expect(nowPlaying).to.be.ok();
      expect(nowPlaying.listenurl).to.be('http://www.kflipcamp.org:8000/kflip');
    });

    it('emits listener count updates only when the count changes', function () {
      let listenerCallbackCount = 0;

      icecast.Start(
        function () {},
        function () {
          listenerCallbackCount += 1;
        }
      );

      const json1 = buildIcecastJson({
        asArray: false,
        sources: [
          {
            listenurl: 'http://www.kflipcamp.org:8000/kflip',
            title: 'Artist - Track - Album',
            listeners: 10,
            audio_info: 'samplerate=44100',
          },
        ],
      });

      const json2 = buildIcecastJson({
        asArray: false,
        sources: [
          {
            listenurl: 'http://www.kflipcamp.org:8000/kflip',
            title: 'Artist - Track - Album',
            listeners: 10,
            audio_info: 'samplerate=44100',
          },
        ],
      });

      const json3 = buildIcecastJson({
        asArray: false,
        sources: [
          {
            listenurl: 'http://www.kflipcamp.org:8000/kflip',
            title: 'Artist - Track - Album',
            listeners: 11,
            audio_info: 'samplerate=44100',
          },
        ],
      });

      icecast.__test.checkForSomethingNew(json1);
      icecast.__test.checkForSomethingNew(json2);
      icecast.__test.checkForSomethingNew(json3);

      // First parse sets listeners, third changes it.
      expect(listenerCallbackCount).to.be(2);
    });
  });
});
