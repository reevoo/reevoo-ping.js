import badgeInjector from 'inject!lib/events/badge';

describe('lib/events/badge', () => {
  let Badge;
  let badge;
  let snowplow;

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    Badge = badgeInjector({
      '../snowplow': snowplow,
    }).default;

    badge = new Badge();
  });


  describe('.rendered', () => {
    let badgeRenderedParams;

    beforeEach(() => {
      badgeRenderedParams = {
        hitType: 'impression',
        trkref: 'TRKREF',
        sku: 'SKU',
        contentType: 'reviewable',
        ctaPageUse: 'single_reviewable',
        ctaStyle: 'terry',
        averageScore: 9.2,
      };
    });

    it('calls Snowplow', () => {
      badge.rendered(badgeRenderedParams);
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: badgeRenderedParams,
        }),
      );
    });

    it('raises an error if hit type is not supplied', () => {
      badgeRenderedParams.hitType = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Hit type/);
    });

    it('raises an error if hit type is not valid', () => {
      badgeRenderedParams.hitType = 'NOT_A_REAL_HIT_TYPE';

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/not included in the list/);
    });

    it('raises an error if content type is not supplied', () => {
      badgeRenderedParams.contentType = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Content type/);
    });

    it('raises an error if content type is not valid', () => {
      badgeRenderedParams.contentType = 'NOT_A_REAL_CONTENT_TYPE';

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/not included in the list/);
    });

    it('raises an error if trkref is not supplied', () => {
      badgeRenderedParams.trkref = undefined;

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/Trkref/);
    });

    it('uses TRKREF from the root scope when not provided as argument', () => {
      badgeRenderedParams.trkref = undefined;
      badge = new Badge('MY_TRKREF');

      badge.rendered(badgeRenderedParams);
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            trkref: 'MY_TRKREF',
          }),
        })
      );
    });

    it('raises an error if ctaPageUse is not valid', () => {
      badgeRenderedParams.ctaPageUse = 'NOT_A_REAL_PAGE_USE';

      expect(() => {
        badge.rendered(badgeRenderedParams);
      }).toThrowError(/not included in the list/);
    });

    it('sorts and stringifies reviewable context', () => {
      badge.rendered({ ...badgeRenderedParams, reviewableContext: { model: 'Focus', manufacturer: 'Ford' }});

      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            reviewableContext: '{"manufacturer":"Ford","model":"Focus"}',
          }),
        })
      );
    });

    it('determines CTA page use from badgeVariant', () => {
      badgeRenderedParams.ctaPageUse = undefined;
      badgeRenderedParams.badgeVariant = 'my_listing123';
      badge.rendered(badgeRenderedParams);

      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            ctaPageUse: 'multi_reviewable',
          }),
        })
      );
    });

    it('determines CTA style from badgeName', () => {
      badgeRenderedParams.ctaStyle = undefined;
      badgeRenderedParams.badgeName = 'my_badge';
      badgeRenderedParams.badgeVariant = 'default';
      badge.rendered(badgeRenderedParams);

      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            ctaStyle: 'my_badge',
          }),
        })
      );
    });

    it('determines CTA style from badgeVariant', () => {
      badgeRenderedParams.ctaStyle = undefined;
      badgeRenderedParams.badgeVariant = 'default';
      badge.rendered(badgeRenderedParams);

      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            ctaStyle: 'default',
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
