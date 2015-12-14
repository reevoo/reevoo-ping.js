import pageInjector from 'inject!lib/events/page';

describe('lib/events/page', () => {
  let page;
  let snowplow;

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    const Page = pageInjector({
      '../snowplow': snowplow,
    }).default;

    page = new Page();
  });

  describe('.viewed', () => {
    it('calls Snowplow', () => {
      page.viewed();
      expect(snowplow).toHaveBeenCalledWith('trackPageView');
    });
  });

  describe('.heartbeat', () => {
    it('calls Snowplow', () => {
      page.heartbeat();
      expect(snowplow).toHaveBeenCalledWith(
        'enableActivityTracking',
        jasmine.anything(),
        jasmine.anything()
      );
    });

    it('raises an error if called after .pageViewed', () => {
      page.viewed();

      expect(() => {
        page.heartbeat();
      }).toThrowError(/pageViewed/);
    });
  });
});
