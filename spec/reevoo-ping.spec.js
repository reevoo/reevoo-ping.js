import reevooPingInjector from 'inject!lib/reevoo-ping';
import { COLLECTOR_URI } from 'lib/config';
import defaultSnowplowConfig from 'lib/snowplow/default-config';

describe('lib/reevoo-ping', () => {
  let snowplow;
  let ReevooPing;
  let ping;

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    ReevooPing = reevooPingInjector({
      './snowplow': snowplow,
    }).default;
  });

  describe('.constructor', () => {
    it('adds a newTracker event to the snowplow queue', () => {
      ping = new ReevooPing.Client('app-name');
      expect(snowplow).toHaveBeenCalledWith(
        'newTracker',
        'app-name',
        COLLECTOR_URI,
        { ...defaultSnowplowConfig, appId: 'app-name' }
      );
    });

    it('allows override default tracker config', () => {
      ping = new ReevooPing.Client('app-name', {}, { pageUnloadTimer: 24 });
      expect(snowplow).toHaveBeenCalledWith(
        'newTracker',
        'app-name',
        COLLECTOR_URI,
        { ...defaultSnowplowConfig, appId: 'app-name', pageUnloadTimer: 24 }
      );
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      ping = new ReevooPing.Client('app-name', { trkref: 'TRKREF' });
    });

    it('responds to #page', () => {
      expect(ping.page).toBeDefined();
    });

    it('responds to #badge', () => {
      expect(ping.badge).toBeDefined();
    });

    it('responds to #experiences', () => {
      expect(ping.experiences).toBeDefined();
    });

    it('responds to #conversion', () => {
      expect(ping.conversion).toBeDefined();
    });

    describe('#trackEvent', () => {
      it('tracks generic events with type property', () => {
        ping.trackEvent({ type: 'TYPE', something: 'bar', abc: 12 });
        expect(snowplow.calls.count()).toEqual(2); // first is tracker init
        expect(snowplow.calls.argsFor(1)).toEqual(['trackUnstructEvent:app-name', {
          schema: 'iglu:com.reevoo/generic_event/jsonschema/1-0-0',
          data: jasmine.objectContaining({
            eventType: 'TYPE',
            trkref: 'TRKREF',
            properties: '{"abc":12,"something":"bar"}',
          }),
        }]);
      });

      it('does not track generic events without type property', () => {
        ping.trackEvent({ something: 'bar', abc: 12 });
        expect(snowplow.calls.count()).toEqual(1); // just tracker init
      });

      it('allows override trkref', () => {
        ping.trackEvent({ type: 'TYPE', trkref: 'OTHER_TRKREF' });
        expect(snowplow.calls.count()).toEqual(2); // first is tracker init
        expect(snowplow.calls.argsFor(1)).toEqual(['trackUnstructEvent:app-name', {
          schema: 'iglu:com.reevoo/generic_event/jsonschema/1-0-0',
          data: jasmine.objectContaining({ trkref: 'OTHER_TRKREF' }),
        }]);
      });
    });
  });
});
