import event from 'lib/events/page/viewed';

describe('lib/events/page/viewed', () => {
  describe('.attach', () => {
    let trigger;

    beforeEach(() => {
      trigger = jasmine.createSpy('trigger');
    });

    it('fires trigger()', () => {
      event.attach(trigger);
      expect(trigger).toHaveBeenCalled();
    });
  });

  describe('.trigger', () => {
    it('fires snowplow\'s trackPageView', () => {
      event.trigger();
      pending('How do I spy on snowplow?');
    });
  });
});
