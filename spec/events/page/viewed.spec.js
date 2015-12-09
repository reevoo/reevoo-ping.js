import eventInjector from 'inject!lib/events/page/viewed';

describe('lib/events/page/viewed', () => {
  let event;
  let snowplow;

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');

    event = eventInjector({
      '../../snowplow': snowplow,
    }).default;
  });

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
      expect(snowplow).toHaveBeenCalledWith('trackPageView');
    });
  });
});
