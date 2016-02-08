// config.js
// Snowplow configuration for Reevoo.
//
// This hash is passed into the `newTracker` action.
export default {

  // Sent with events.
  appId: 'reevoo-ping.js',

  // Enable cookie access across sub-domains.
  cookieDomain: '.reevoo.com',
  cookieName: 'reevoo_snowplow',

  // TODO: Be nice.
  respectDoNotTrack: false,

  // Wait and send events before changing page.
  pageUnloadTimer: 100,

  // Conntect to the Collector via HTTPS only.
  forceSecureTracker: true,

  // Add contexts to every event.
  contexts: {
    webPage: true,
    performanceTiming: false,
    gaCookies: true,
    geolocation: false,
  },

  // Add cross-domain linking on all links.
  crossDomainLinker: function crossDomainLinker() {
    // Snowplow does cross-domain linking by sending
    // an _sp query parameter with the link-click URL.
    // We're probably better off relying on a User ID.
    //
    // If we need to do this in future, we need to ensure
    // in-site links aren't linked.
    return false;
  },

};
