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

    it('raises an error if badge type is not supplied', () => {
      badgeRenderedParams.badge_type = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Badge type/);
    });

    it('raises an error if badge name is not supplied', () => {
      badgeRenderedParams.badge_name = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Badge name/);
    });
  });

  describe('.seen', () => {
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
      badge.seen(badgeSeenParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('raises an error if badge type is not supplied', () => {
      badgeSeenParams.badge_type = undefined;

      expect(() => {
        badge.seen(badgeSeenParams);
      }).toThrowError(/Badge type/);
    });

    it('raises an error if badge name is not supplied', () => {
      badgeSeenParams.badge_name = undefined;

      expect(() => {
        badge.seen(badgeSeenParams);
      }).toThrowError(/Badge name/);
    });
  });
});
