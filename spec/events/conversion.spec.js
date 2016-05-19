import conversionInjector from 'inject!lib/events/conversion';
import omit from 'object.omit';

describe('lib/events/conversion', () => {
  let Conversion;
  let conversion;
  let snowplow;
  let consoleError;

  function expectItReportsError(matchMessage) {
    expect(consoleError).toHaveBeenCalledWith(jasmine.stringMatching(matchMessage));
  }

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    consoleError = spyOn(console, 'error');
    Conversion = conversionInjector({
      '../snowplow': snowplow,
    }).default;

    conversion = new Conversion();
  });


  describe('.track', () => {
    let conversionEventParams;

    beforeEach(() => {
      conversionEventParams = {
        trkref: 'TRKREF',
        reviewableContext: { sku: 'SKU' },
        basketValue: '50 GBP',
      };
    });

    it('calls Snowplow', () => {
      conversion.track('purchase', conversionEventParams);
      expect(snowplow).toHaveBeenCalledWith(
        'trackUnstructEvent',
        jasmine.objectContaining({
          schema: 'iglu:com.reevoo/conversion_event/jsonschema/1-0-0',
          data: jasmine.objectContaining({
            ...omit(conversionEventParams, 'basketValue', 'reviewableContext'),
            eventType: 'purchase',
            reviewableContext: '{"sku":"SKU"}',
            additionalProperties: '{"basketValue":"50 GBP"}',
          }),
        }),
      );
    });

    it('reports an error if event type is not valid', () => {
      conversion.track('foo', conversionEventParams);
      expectItReportsError(/foo is not included in the list/);
    });

    it('reports an error if trkref is not supplied', () => {
      conversionEventParams.trkref = undefined;
      conversion.track('purchase', conversionEventParams);
      expectItReportsError(/Trkref/);
    });

    it('uses TRKREF from the root scope when not provided as argument', () => {
      conversionEventParams.trkref = undefined;
      conversion = new Conversion('MY_TRKREF');

      conversion.track('purchase', conversionEventParams);
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            trkref: 'MY_TRKREF',
          }),
        })
      );
    });

    it('sorts and stringifies reviewable context', () => {
      conversion.track('purchase', { ...conversionEventParams, reviewableContext: { model: 'Focus', manufacturer: 'Ford' }});

      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            reviewableContext: '{"manufacturer":"Ford","model":"Focus"}',
          }),
        })
      );
    });
  });


  describe('shortcut methods', () => {
    const testParams = { foo: 'bar '};
    const methodEventTypeMap = {
      purchase : 'purchase',
      checkout: 'checkout',
      propensityToBuy: 'propensity_to_buy',
    };

    Object.keys(methodEventTypeMap).forEach((methodName) => {
      describe(`.${methodName}`, () => {
        it('calls track method', () => {
          const trackMethod = spyOn(conversion, 'track');
          conversion[methodName](testParams);
          expect(trackMethod).toHaveBeenCalledWith(methodEventTypeMap[methodName], testParams);
        });
      });
    });
  });
});
