// reevoo-ping.js
//
// Main event recording class.

import { COLLECTOR_URI } from './config';
import snowplow from './snowplow';
import defaultSnowplowConfig from './snowplow/default-config';
import validate from './validate';
import Experiences from './events/experiences';
import Page from './events/page';
import Badge from './events/badge';

class Client {
  constructor(appId, opts = {}, trackerConfig = {}) {
    // Initialise the tracker
    const trackerName = 'reevoo';
    const snowplowTrackerConfig = { ...defaultSnowplowConfig, ...trackerConfig, appId };
    snowplow('newTracker', trackerName, COLLECTOR_URI, snowplowTrackerConfig);

    // Init event factories
    this.experiences = new Experiences();
    this.page = new Page();
    this.badge = new Badge(opts.trkref);
  }
}

// This allows the in-script usage:
//   var x = new window.ReevooPing.Client(...);
export { Client };

// This allows ES6 module usage:
//   import ReevooPing from 'reevoo-ping.js';
//   const ping = new ReevooPing.Client(...);
export default { Client };
