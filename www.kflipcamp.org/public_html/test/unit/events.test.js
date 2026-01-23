const expect = require('expect.js');

// events.js currently initializes googleapis auth at module load time.
// These unit tests stub the module's internal calendar client via __test hooks.
const events = require('../../events');

function makeEvent({ id, startIso, endIso, summary = 'Show', recurrence = null }) {
  const e = {
    id,
    summary,
    start: { dateTime: startIso },
    end: { dateTime: endIso },
  };
  if (recurrence) e.recurrence = recurrence;
  return e;
}

describe('events', function () {
  beforeEach(function () {
    events.__test.reset();
  });

  describe('getEventList processing (sorting + bad event detection)', function () {
    it('filters out recurring events and sorts remaining events by startDate ascending', async function () {
      const now = new Date('2026-01-01T00:00:00.000Z');

      const items = [
        makeEvent({ id: '2', startIso: '2026-01-01T01:00:00.000Z', endIso: '2026-01-01T02:00:00.000Z', summary: 'B' }),
        makeEvent({ id: '1', startIso: '2026-01-01T00:10:00.000Z', endIso: '2026-01-01T01:10:00.000Z', summary: 'A' }),
        makeEvent({
          id: 'bad',
          startIso: '2026-01-01T03:00:00.000Z',
          endIso: '2026-01-01T04:00:00.000Z',
          summary: 'Recurring',
          recurrence: ['RRULE:FREQ=WEEKLY'],
        }),
      ];

      events.__test.setCalendarListImpl(async function () {
        return {
          data: {
            updated: now.toISOString(),
            items,
          },
        };
      });

      const list = await events.__test.getEventList();
      expect(list).to.be.ok();
      expect(list.data.items.map((e) => e.id)).to.eql(['1', '2']);
      expect(list.data.items[0].startDate).to.be.a(Date);
    });
  });

  describe('getEventsAsync (event start/end lifecycle)', function () {
    it('calls onEventStart when now enters event window and onEventEnd when it leaves', async function () {
      const base = new Date('2026-01-01T00:00:00.000Z');

      const event = makeEvent({
        id: 'evt',
        startIso: '2026-01-01T00:10:00.000Z',
        endIso: '2026-01-01T00:20:00.000Z',
        summary: 'Test Event',
      });

      // Use start/end times that are far enough away from the default buffer
      // (config.extraStartTime/config.extraEndTime) so the lifecycle is deterministic.
      const items = [event];

      // Make list() return the same single event.
      events.__test.setCalendarListImpl(async function () {
        return {
          data: {
            updated: base.toISOString(),
            items,
          },
        };
      });

      let starts = 0;
      let ends = 0;

      // Wire the real module callbacks.
      events.__test.setCallbacks({
        onScheduleChange: function () {},
        onEventStart: async function () { starts += 1; },
        onEventEnd: async function () { ends += 1; },
        addToEngineeringLog: function () {}
      });

      // 1) Before event window
      // Pick a time well before the start time minus any reasonable buffer.
      events.__test.setNowMs(new Date('2025-12-31T23:30:00.000Z').getTime());
      await events.__test.getEventsAsync();
      expect(starts).to.be(0);
      expect(ends).to.be(0);

      // 2) During event window
      events.__test.setNowMs(new Date('2026-01-01T00:15:00.000Z').getTime());
      await events.__test.getEventsAsync();
      expect(starts).to.be(1);
      expect(ends).to.be(0);

      // 3) After event window
      // Pick a time well after the end time plus any reasonable buffer.
      events.__test.setNowMs(new Date('2026-01-01T00:50:00.000Z').getTime());
      await events.__test.getEventsAsync();
      expect(starts).to.be(1);
      expect(ends).to.be(1);
    });
  });
});
