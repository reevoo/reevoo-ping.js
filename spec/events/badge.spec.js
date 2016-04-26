import badgeInjector from 'inject!lib/events/badge';

describe('lib/events/badge', () => {
  let Badge;
  let badge;
  let snowplow;
  let consoleError;

  function expectItReportsError(matchMessage) {
    expect(consoleError).toHaveBeenCalledWith(jasmine.stringMatching(matchMessage));
  }

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    consoleError = spyOn(console, 'error');
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

    it('reports an error if hit type is not supplied', () => {
      badgeRenderedParams.hitType = undefined;
      badge.rendered(badgeRenderedParams);
      expectItReportsError(/Hit type/);
    });

    it('reports an error if hit type is not valid', () => {
      badgeRenderedParams.hitType = 'NOT_A_REAL_HIT_TYPE';
      badge.rendered(badgeRenderedParams);
      expectItReportsError(/not included in the list/);
    });

    it('reports an error if content type is not supplied', () => {
      badgeRenderedParams.contentType = undefined;
      badge.rendered(badgeRenderedParams);
      expectItReportsError(/Content type/);
    });

    it('reports an error if content type is not valid', () => {
      badgeRenderedParams.contentType = 'NOT_A_REAL_CONTENT_TYPE';
      badge.rendered(badgeRenderedParams);
      expectItReportsError(/not included in the list/);
    });

    it('reports an error if trkref is not supplied', () => {
      badgeRenderedParams.trkref = undefined;
      badge.rendered(badgeRenderedParams);
      expectItReportsError(/Trkref/);
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

    it('reports an error if ctaPageUse is not valid', () => {
      badgeRenderedParams.ctaPageUse = 'NOT_A_REAL_PAGE_USE';
      badge.rendered(badgeRenderedParams);
      expectItReportsError(/not included in the list/);
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

    describe('determines CTA page use', () => {
      it('uses multi_reviewable if badgeVariant contains listing', () => {
        badge.rendered({ ...badgeRenderedParams, ctaPageUse: undefined, badgeVariant: 'my_listing123' });

        expect(snowplow).toHaveBeenCalledWith(
          jasmine.anything(),
          jasmine.objectContaining({
            data: jasmine.objectContaining({
              ctaPageUse: 'multi_reviewable',
            }),
          })
        );
      });

      it('uses multi_reviewable if badgeVariant contains category', () => {
        badge.rendered({ ...badgeRenderedParams, ctaPageUse: undefined, badgeVariant: 'my_category123' });

        expect(snowplow).toHaveBeenCalledWith(
          jasmine.anything(),
          jasmine.objectContaining({
            data: jasmine.objectContaining({
              ctaPageUse: 'multi_reviewable',
            }),
          })
        );
      });

      it('uses single_reviewable otherwise', () => {
        badge.rendered({ ...badgeRenderedParams, ctaPageUse: undefined, badgeVariant: 'my_foo123' });

        expect(snowplow).toHaveBeenCalledWith(
          jasmine.anything(),
          jasmine.objectContaining({
            data: jasmine.objectContaining({
              ctaPageUse: 'single_reviewable',
            }),
          })
        );
      });
    });

    describe('determines CTA style', () => {
      it('uses badgeName if available', () => {
        badge.rendered({ ...badgeRenderedParams, ctaStyle: undefined, badgeName: 'my_badge', badgeVariant: 'default' });

        expect(snowplow).toHaveBeenCalledWith(
          jasmine.anything(),
          jasmine.objectContaining({
            data: jasmine.objectContaining({
              ctaStyle: 'my_badge',
            }),
          })
        );
      });

      it('uses badgeVariant if badgeName not available', () => {
        badge.rendered({ ...badgeRenderedParams, ctaStyle: undefined, badgeName: undefined, badgeVariant: 'default' });

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

    it('reports an error if trkref is not supplied', () => {
      badgeSeenParams.trkref = undefined;
      badge.seen(badgeSeenParams);
      expectItReportsError(/Trkref/);
    });

    it('reports an error if badge type is not supplied', () => {
      badgeSeenParams.badge_type = undefined;
      badge.seen(badgeSeenParams);
      expectItReportsError(/Badge type/);
    });
  });
});
