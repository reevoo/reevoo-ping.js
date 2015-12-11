// reevoo-ping.js
//
// Main event recording class.

import validate from './validate';
import snowplow from './snowplow';
import { error } from './logging';
import Page from './events/page';

const secsBetweenHeartbeats = 30;

class ReevooPing {
  constructor(opts) {
    validate(opts, {
      trkref: { presence: true },
    });

    this.trkref = opts.trkref;
    this.trackPageViewCalled = false;
  }

  // To be triggered when a page containing Reevoo content is loaded.
  pageViewed() {
    snowplow('trackPageView');
    this.trackPageViewCalled = true;
  }

  // Setup page pings.
  // If you use this, you don't need to call pageViewed().
  heartbeat() {
    if (this.trackPageViewCalled) {
      error(
`heartbeat() was called after a pageViewed() call, which is not supported by Snowplow.
 Remove the pageViewed() call.`
      );
    }

    // The arguments to enableActivityTracking are secsBeforeFirstHeartbeat and secsBetweenHeartbeats;
    // we have no need to have these as different values though.
    snowplow('enableActivityTracking', secsBetweenHeartbeats, secsBetweenHeartbeats);
    this.pageViewed();
  }

  // To be triggered when a badge is rendered on the page.
  badgeRendered(opts) {
    opts.trkref = opts.trkref || this.trkref;

    validate(opts, {
      hit_type: { presence: true, inclusion: ['hit', 'miss', 'non_impression'] },
      badge_name: { presence: true },
      badge_type: { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_rendered/jsonschema/1-0-0', // TO BE DEFINED
      data: opts,
    });
  }

  // To be triggered when a badge enters the user's viewport. (Kinky.)
  badgeSeen(opts) {
    opts.trkref = opts.trkref || this.trkref;

    validate(opts, {
      badge_name: { presence: true },
      badge_type: { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_seen/jsonschema/1-0-0', // TO BE DEFINED
      data: opts,
    });
  }
}

window.ReevooPing = ReevooPing;
export default ReevooPing;
