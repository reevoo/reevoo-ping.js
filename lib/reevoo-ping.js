// reevoo-ping.js
//
// Main event recording class.

import stringify              from 'json-stable-stringify';
import { COLLECTOR_URI }      from './config';
import snowplow               from './snowplow';
import defaultSnowplowConfig  from './snowplow/default-config';
import Experiences            from './events/experiences';
import Page                   from './events/page';
import Badge                  from './events/badge';
import Conversion             from './events/conversion';

class Client {
  constructor(appId, opts = {}, trackerConfig = {}, win = window) {
    if (!appId) throw new Error('appId argument is required');

    // Initialise the tracker
    const snowplowTrackerConfig = { ...defaultSnowplowConfig, ...trackerConfig, appId };
    snowplow('newTracker', appId, COLLECTOR_URI, snowplowTrackerConfig);

    // Snowplow collector cannot handle URLs with characters violating RFC 2396, if customer URL contains some of
    // them we set our custom encoded version to be tracked.
    const encodedURI = encodeURI(win.location.href).replace(/!/g, '%21');
    if (encodedURI !== win.location.href) {
      snowplow('setCustomUrl', encodedURI);
    }

    // Tracker bounded to the current instance of Client (to support multiple instances with diferrent appId)
    const boundedTracker = (command, ...args) => {
      snowplow(`${command}:${appId}`, ...args);
    };

    // Generic event tracking (useful for redux flow)
    this.trackEvent = function({ type, trkref, ...properties }) {
      if (!type) return console.error('[reevoo-ping] trackEvent: You have to pass object with type property');
      boundedTracker('trackUnstructEvent', {
        schema: 'iglu:com.reevoo/generic_event/jsonschema/1-0-0',
        data: {
          eventType: type,
          trkref: trkref || opts.trkref,
          properties: stringify(properties),
        },
      });
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
