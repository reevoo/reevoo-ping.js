import badgeInjector from 'inject!lib/events/badge';
import omit from 'object.omit';

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


  describe('.track', () => {
    let badgeEventParams;

    beforeEach(() => {
      badgeEventParams = {
        hitType: 'impression',
        trkref: 'TRKREF',
        reviewableContext: { sku: 'SKU' },
        contentType: 'reviewable',
        ctaPageUse: 'single_reviewable',
        ctaStyle: 'terry',
        implementation: 'link',
        averageScore: 9.2,
      };
    });

    it('calls Snowplow', () => {
      badge.rendered(badgeEventParams);
      expect(snowplow).toHaveBeenCalledWith(
        'trackUnstructEvent',
        jasmine.objectContaining({
          schema: 'iglu:com.reevoo/badge_event/jsonschema/1-0-0',
          data: jasmine.objectContaining({
            ...omit(badgeEventParams, 'averageScore', 'reviewableContext'),
            eventType: 'rendered',
            reviewableContext: '{"sku":"SKU"}',
            additionalProperties: '{"averageScore":9.2}',
          }),
        }),
      );
    });

    it('reports an error if hit type is not supplied', () => {
      badgeEventParams.hitType = undefined;
      badge.rendered(badgeEventParams);
      expectItReportsError(/Hit type/);
    });

    it('reports an error if hit type is not valid', () => {
      badgeEventParams.hitType = 'NOT_A_REAL_HIT_TYPE';
      badge.rendered(badgeEventParams);
      expectItReportsError(/not included in the list/);
    });

    it('reports an error if content type is not supplied', () => {
      badgeEventParams.contentType = undefined;
      badge.rendered(badgeEventParams);
      expectItReportsError(/Content type/);
    });

    it('reports an error if content type is not valid', () => {
      badgeEventParams.contentType = 'NOT_A_REAL_CONTENT_TYPE';
      badge.rendered(badgeEventParams);
      expectItReportsError(/not included in the list/);
    });

    it('reports an error if trkref is not supplied', () => {
      badgeEventParams.trkref = undefined;
      badge.rendered(badgeEventParams);
      expectItReportsError(/Trkref/);
    });

    it('uses TRKREF from the root scope when not provided as argument', () => {
      badgeEventParams.trkref = undefined;
      badge = new Badge('MY_TRKREF');

      badge.rendered(badgeEventParams);
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
      badgeEventParams.ctaPageUse = 'NOT_A_REAL_PAGE_USE';
      badge.rendered(badgeEventParams);
      expectItReportsError(/not included in the list/);
    });

    it('sorts and stringifies reviewable context', () => {
      badge.rendered({ ...badgeEventParams, reviewableContext: { model: 'Focus', manufacturer: 'Ford' }});

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
        badge.rendered({ ...badgeEventParams, ctaPageUse: undefined, badgeVariant: 'my_listing123' });

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
        badge.rendered({ ...badgeEventParams, ctaPageUse: undefined, badgeVariant: 'my_category123' });

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
        badge.rendered({ ...badgeEventParams, ctaPageUse: undefined, badgeVariant: 'my_foo123' });

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
        badge.rendered({ ...badgeEventParams, ctaStyle: undefined, badgeName: 'my_badge', badgeVariant: 'default' });

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
        badge.rendered({ ...badgeEventParams, ctaStyle: undefined, badgeName: undefined, badgeVariant: 'default' });

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


  describe('shortcut methods', () => {
    const testParams = { foo: 'bar '};

    ['rendered', 'seen', 'clicked'].forEach((eventType) => {
      describe(`.${eventType}`, () => {
        it('calls track method', () => {
          const trackMethod = spyOn(badge, 'track');
          badge[eventType](testParams);
          expect(trackMethod).toHaveBeenCalledWith(eventType, testParams);
        });
      });
    });
  });
});
