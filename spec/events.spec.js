import events from 'lib/events';

describe('lib/events', () => {
  describe('on initialization', () => {
    it('has a non-zero event count', () => {
      expect(events.count).toBeGreaterThan(0);
    });
  });

  describe('.get', () => {
    beforeEach(() => {
      events.add({
        name: 'foo',
      });
    });

    it('retrieves an event by name', () => {
      expect(events.get('foo').name).toEqual('foo');
    });
  });
});
