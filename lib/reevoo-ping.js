// reevoo-ping.js
//
// Main event recording class.

import validate from './validate';
import snowplow from './snowplow';
import { error } from './logging';

const secsBetweenHeartbeats = 30;

class ReevooPing {
  constructor(opts) {
    validate(opts, {
      trkref: { presence: true },
    });

    this.trkref = opts.trkref;
    this.trackPageViewCalled = false;
  }

  pageViewed() {
    snowplow('trackPageView');
    this.trackPageViewCalled = true;
  }

  // Setup page pings.
  // If you use this, you don't need to call pageViewed().
  heartbeat() {
    if (this.trackPageViewCalled) {
      error(
`heartbeat() was called after a pageViewed() call.
 Remove the pageViewed() call.`
      );
    }

    // The arguments to enableActivityTracking are secsBeforeFirstHeartbeat and secsBetweenHeartbeats;
    // we have no need to have these as different values though.
    snowplow('enableActivityTracking', secsBetweenHeartbeats, secsBetweenHeartbeats);
    this.pageViewed();
  }

  badgeRendered(opts) {
    opts.trkref = opts.trkref || this.trkref;

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_rendered/jsonschema/1-0-0', // TO BE DEFINED
      data: opts,
    });
  }
}

window.ReevooPing = ReevooPing;
export default ReevooPing;
