import badgeInjector from 'inject!lib/events/badge';

describe('lib/events/badge', () => {
  let badge;
  let snowplow;

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    const Badge = badgeInjector({
      '../snowplow': snowplow,
    }).default;

    badge = new Badge();
  });


  describe('.rendered', () => {
    let badgeRenderedParams;

    beforeEach(() => {
      badgeRenderedParams = {
        hit_type: 'hit',
        trkref: 'TRKREF',
        sku: 'SKU',
        average_score: 9.2,
        badge_type: 'product_reviews',
        badge_variant: 'default',
        badge_name: 'terry',
      };
    });

    it('calls Snowplow', () => {
      badge.rendered(badgeRenderedParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('raises an error if hit type is not supplied', () => {
      badgeRenderedParams.hit_type = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Hit type/);
    });

    it('raises an error if hit type is not valid', () => {
      badgeRenderedParams.hit_type = 'NOT_A_REAL_HIT_TYPE';

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError();
    });

    it('raises an error if badge type is not supplied', () => {
      badgeRenderedParams.badge_type = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Badge type/);
    });

    it('raises an error if trkref is not supplied', () => {
      badgeRenderedParams.trkref = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Trkref/);
    });

    it('includes a JSON-encoded string of the options given', () => {
      const expectedJsonString = JSON.stringify(badgeRenderedParams);

      badge.rendered(badgeRenderedParams);

      // payload.data.fullBadgeParams contains our JSON string.
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            fullBadgeParams: expectedJsonString,
          }),
        })
      );
    });
  });

  describe('.seen', () => {
    let badgeSeenParams;

    beforeEach(() => {
      badgeSeenParams = {
        trkref: 'TRKREF',
        sku: 'SKU',
        average_score: 9.2,
        badge_type: 'product_reviews',
        badge_variant: 'default',
        badge_name: 'terry',
      };
    });

    it('calls Snowplow', () => {
      badge.seen(badgeSeenParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('raises an error if trkref is not supplied', () => {
      badgeSeenParams.trkref = undefined;

      expect(() => {
        badge.seen(badgeSeenParams);
      }).toThrowError(/Trkref/);
    });

    it('raises an error if badge type is not supplied', () => {
      badgeSeenParams.badge_type = undefined;

      expect(() => {
        badge.seen(badgeSeenParams);
      }).toThrowError(/Badge type/);
    });
  });
});
