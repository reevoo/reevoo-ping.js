import reevooPingInjector from 'inject!lib/reevoo-ping';

describe('lib/reevoo-ping', () => {
  let ReevooPing;
  let snowplow;

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    ReevooPing = reevooPingInjector({
      './snowplow': snowplow,
    }).default;
  });

  it('defines ReevooPing', () => {
    expect(ReevooPing).toBeDefined();
  });

  describe('.constructor', () => {
    it('throws an error if the trkref is not given', () => {
      expect(() => {
        new ReevooPing({}); // eslint-disable-line no-new
      }).toThrowError(/Trkref/);
    });

    it('returns object with valid options', () => {
      expect(() => {
        new ReevooPing({ trkref: 'TRKREF' }); // eslint-disable-line no-new
      }).not.toThrowError();
    });
  });

  let ping;
  beforeEach(() => {
    ping = new ReevooPing({ trkref: 'TRKREF' });
  });

  it('has page events', () => {
    expect(ping.page).toBeDefined();
  });

  describe('.pageViewed', () => {
    it('calls Snowplow', () => {
      ping.page.viewed();
      expect(snowplow).toHaveBeenCalledWith('trackPageView');
    });
  });

  describe('.heartbeat', () => {
    it('calls Snowplow', () => {
      ping.page.heartbeat();
      expect(snowplow).toHaveBeenCalledWith(
        'enableActivityTracking',
        jasmine.anything(),
        jasmine.anything()
      );
    });

    it('raises an error if called after .pageViewed', () => {
      ping.page.viewed();

      expect(() => {
        ping.page.heartbeat();
      }).toThrowError(/pageViewed/);
    });
  });

  describe('.badgeRendered', () => {
    let badgeRenderedParams;

    beforeEach(() => {
      badgeRenderedParams = {
        hit_type: 'hit',
        sku: 'SKU',
        average_score: 9.2,
        badge_type: 'product_reviews',
        badge_variant: 'default',
        badge_name: 'terry',
      };
    });

    it('calls Snowplow', () => {
      ping.badgeRendered(badgeRenderedParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('raises an error if hit type is not supplied', () => {
      badgeRenderedParams.hit_type = undefined;

      expect(() => {
        ping.badgeRendered(badgeRenderedParams);
      }).toThrowError(/Hit type/);
    });

    it('raises an error if badge type is not supplied', () => {
      badgeRenderedParams.badge_type = undefined;

      expect(() => {
        ping.badgeRendered(badgeRenderedParams);
      }).toThrowError(/Badge type/);
    });

    it('raises an error if badge name is not supplied', () => {
      badgeRenderedParams.badge_name = undefined;

      expect(() => {
        ping.badgeRendered(badgeRenderedParams);
      }).toThrowError(/Badge name/);
    });
  });

  describe('.badgeSeen', () => {
    let badgeSeenParams;

    beforeEach(() => {
      badgeSeenParams = {
        sku: 'SKU',
        average_score: 9.2,
        badge_type: 'product_reviews',
        badge_variant: 'default',
        badge_name: 'terry',
      };
    });

    it('calls Snowplow', () => {
      ping.badgeSeen(badgeSeenParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('raises an error if badge type is not supplied', () => {
      badgeSeenParams.badge_type = undefined;

      expect(() => {
        ping.badgeSeen(badgeSeenParams);
      }).toThrowError(/Badge type/);
    });

    it('raises an error if badge name is not supplied', () => {
      badgeSeenParams.badge_name = undefined;

      expect(() => {
        ping.badgeSeen(badgeSeenParams);
      }).toThrowError(/Badge name/);
    });
  });
});
