import snowplowInjector from 'inject!lib/snowplow';

describe('lib/snowplow', () => {
  let snowplow;
  let internalSnowplow;
  let debug;

  beforeEach(() => {
    internalSnowplow = jasmine.createSpy('internalSnowplow');
    debug = jasmine.createSpy('debug');

    snowplow = snowplowInjector({
      './snowplow/bootstrap': internalSnowplow,
      './logging': { debug },
    }).default;
  });

  describe('export', () => {
    it('exports a function', () => {
      expect(snowplow).toBeDefined();
    });
  });

  it('logs to debug when called', () => {
    snowplow('test');
    expect(debug).toHaveBeenCalled();
  });

  it('calls internal snowplow when called', () => {
    snowplow('test');
    expect(internalSnowplow).toHaveBeenCalledWith('test');
  });
});
