// page.js
//
// Page events.

import { error } from '../logging'

// The number of seconds between page pings.
const secsBetweenHeartbeats = 30

export default class Page {
  constructor(tracker) {
    this.tracker = tracker
    this.trackPageViewCalled = false
  }

  // To be triggered when a page containing Reevoo content is loaded.
  viewed() {
    this.tracker('trackPageView')
    this.trackPageViewCalled = true
  }

  // Setup page pings.
  // If you use this, you don't need to call pageViewed().
  heartbeat() {
    if (this.trackPageViewCalled) {
      error(
        `heartbeat() was called after a pageViewed() call, which is not supported by Snowplow.
 Remove the pageViewed() call.`
      )
    }

    // The arguments to enableActivityTracking are secsBeforeFirstHeartbeat and secsBetweenHeartbeats;
    // we have no need to have these as different values though.
    this.tracker('enableActivityTracking', secsBetweenHeartbeats, secsBetweenHeartbeats)
    this.viewed()
  }
}
