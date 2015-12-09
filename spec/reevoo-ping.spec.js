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
  };
  events.count = 2;

  return events;
}

describe('lib/reevoo-ping', () => {
  let reevooPing;

  beforeEach(() => {
    reevooPing = reevooPingInjector({
      './events': mockEvents(),
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
});
