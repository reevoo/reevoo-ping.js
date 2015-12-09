import snowplowInjector from 'inject!lib/snowplow';

describe('lib/snowplow', () => {
  let snowplow;
  let internalSnowplow;
  let debug;

  beforeEach(() => {
    internalSnowplow = jasmine.createSpy();
    debug = jasmine.createSpy();

    snowplow = snowplowInjector({
      './snowplow/bootstrap': internalSnowplow,
      './debug': debug,
    }).default;
  });

  describe('after it is required', () => {
    it('adds a newTracker event to the snowplow queue', () => {
      expect(internalSnowplow).toHaveBeenCalledWith(
        'newTracker',
        jasmine.anything(),
        jasmine.anything(),
        jasmine.anything()
      );
    });
  });

  describe('export', () => {
    it('exports a function', () => {
      expect(snowplow).toBeDefined();
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
});
