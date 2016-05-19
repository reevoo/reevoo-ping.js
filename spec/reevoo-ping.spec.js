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
        'reevoo',
        COLLECTOR_URI,
        { ...defaultSnowplowConfig, appId: 'app-name' }
      );
    });

    it('allows override default tracker config', () => {
      ping = new ReevooPing.Client('app-name', {}, { pageUnloadTimer: 24 });
      expect(snowplow).toHaveBeenCalledWith(
        'newTracker',
        'reevoo',
        COLLECTOR_URI,
        { ...defaultSnowplowConfig, appId: 'app-name', pageUnloadTimer: 24 }
      );
    });
  });

  describe('instance', () => {
    beforeEach(() => {
      ping = new ReevooPing.Client('app-name', { trkref: 'TRKREF' });
    });

    it('has page events factory', () => {
      expect(ping.page).toBeDefined();
    });

    it('has badge events factory', () => {
      expect(ping.badge).toBeDefined();
    });

    it('has experiences events factory', () => {
      expect(ping.experiences).toBeDefined();
    });

    it('has conversion events factory', () => {
      expect(ping.conversion).toBeDefined();
    });
  });
});
