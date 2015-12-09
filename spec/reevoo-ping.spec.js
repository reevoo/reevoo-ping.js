import reevooPingInjector from 'inject!lib/reevoo-ping';

import events from 'lib/events';
function mockEvents() {
  events.dict = {
    foo: {
      name: 'foo',
      attach: jasmine.createSpy('attachFoo'),
      detach: jasmine.createSpy('detachFoo'),
    },
    bar: {
      name: 'bar',
      attach: jasmine.createSpy('attachBar'),
      detach: jasmine.createSpy('detachBar'),
    },
    baz: {
      name: 'baz',
      attach: jasmine.createSpy('attachBaz'),
      detach: jasmine.createSpy('detachBaz'),
    },
  };
  events.count = 2;

  return events;
}

import eventSets from 'lib/event_sets';
function mockEventSets() {
  eventSets.fooBarSet = ['foo', 'bar'];
}

describe('lib/reevoo-ping', () => {
  let reevooPing;

  beforeEach(() => {
    reevooPing = reevooPingInjector({
      './events': mockEvents(),
      './event_sets': mockEventSets(),
    }).default;
  });

  describe('when imported', () => {
    it('defines window.reevooPing', () => {
      expect(window.reevooPing).toBeDefined();
    });
  });

  it('defines reevooPing', () => {
    expect(reevooPing).toBeDefined();
  });

  describe('.sendEventsWhen', () => {
    it('raises an error when an event cannot be found', () => {
      expect(() => {
        reevooPing.sendEventsWhen(['NOT THERE']);
      }).toThrowError(/NOT THERE/);
    });

    it('replaces existing events', () => {
      reevooPing.sendEventsWhen(['foo']);
      expect(reevooPing.events.find(item => item.name === 'foo')).toBeDefined();

      reevooPing.sendEventsWhen(['bar']);
      expect(reevooPing.events.find(item => item.name === 'foo')).not.toBeDefined();
    });

    it('calls attach() on new events', () => {
      reevooPing.sendEventsWhen(['foo']);
      expect(events.dict.foo.attach).toHaveBeenCalled();
    });

    it('calls detach() on old events', () => {
      reevooPing.sendEventsWhen(['foo']);
      expect(events.dict.foo.detach).not.toHaveBeenCalled();

      reevooPing.sendEventsWhen(['bar']);
      expect(events.dict.foo.detach).toHaveBeenCalled();
    });
  });

  describe('.clearEvents', () => {
    it('calls detach() on old events', () => {
      reevooPing.sendEventsWhen(['foo']);
      expect(events.dict.foo.detach).not.toHaveBeenCalled();

      reevooPing.clearEvents();
      expect(events.dict.foo.detach).toHaveBeenCalled();
    });
  });

  describe('.sendEventSet', () => {
    it('raises an error when an event set cannot be found', () => {
      expect(() => {
        reevooPing.sendEventSet('NOT THERE');
      }).toThrowError(/NOT THERE/);
    });

    it('sets the events of the event set', () => {
      reevooPing.sendEventSet('fooBarSet');
      expect(reevooPing.events.find(item => item.name === 'foo')).toBeDefined();
      expect(reevooPing.events.find(item => item.name === 'bar')).toBeDefined();
    });

    it('replaces existing events', () => {
      reevooPing.sendEventsWhen(['baz']);
      expect(reevooPing.events.find(item => item.name === 'baz')).toBeDefined();

      reevooPing.sendEventSet('fooBarSet');
      expect(reevooPing.events.find(item => item.name === 'baz')).not.toBeDefined();
    });

    it('calls attach() on new events', () => {
      reevooPing.sendEventSet('fooBarSet');
      expect(events.dict.foo.attach).toHaveBeenCalled();
      expect(events.dict.bar.attach).toHaveBeenCalled();
    });

    it('calls detach() on old events', () => {
      reevooPing.sendEventsWhen(['baz']);
      expect(events.dict.baz.detach).not.toHaveBeenCalled();

      reevooPing.sendEventSet('fooBarSet');
      expect(events.dict.baz.detach).toHaveBeenCalled();
    });
  });
});
