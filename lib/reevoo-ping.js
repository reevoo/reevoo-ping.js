// reevoo-ping.js
//
// Main event recording class.

import { COLLECTOR_URI }      from './config';
import snowplow               from './snowplow';
import defaultSnowplowConfig  from './snowplow/default-config';
import Experiences            from './events/experiences';
import Page                   from './events/page';
import Badge                  from './events/badge';
import Conversion             from './events/conversion';

class Client {
  constructor(appId, opts = {}, trackerConfig = {}) {
    if (!appId) throw new Error('appId argument is required');

    // Initialise the tracker
    const snowplowTrackerConfig = { ...defaultSnowplowConfig, ...trackerConfig, appId };
    snowplow('newTracker', appId, COLLECTOR_URI, snowplowTrackerConfig);

    // Tracker bounded to the current instance of Client (to support multiple instances with diferrent appId)
    const boundedTracker = (command, ...args) => {
      snowplow(`${command}:${appId}`, ...args);
    };

    // Init event factories
    this.experiences  = new Experiences(boundedTracker);
    this.page         = new Page(boundedTracker);
    this.badge        = new Badge(boundedTracker, opts.trkref);
    this.conversion   = new Conversion(boundedTracker, opts.trkref);
  }
}

// This allows the in-script usage:
//   var x = new window.ReevooPing.Client(...);
export { Client };

// This allows ES6 module usage:
//   import ReevooPing from 'reevoo-ping.js';
//   const ping = new ReevooPing.Client(...);
export default { Client };
