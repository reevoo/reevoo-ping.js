// config.js
// Snowplow configuration for Reevoo.
//
// This hash is passed into the `newTracker` action.
export default {
  // Enable cookie access across sub-domains.
  cookieDomain: null,
  discoverRootDomain: true,
  cookieName: 'reevoo_sp_',
  cookieSameSite: 'Lax',

  // Be nice.
  respectDoNotTrack: true,

  // Wait and send events before changing page.
  pageUnloadTimer: 100,

  // Conntect to the Collector via HTTPS only.
  forceSecureTracker: true,

  // Add contexts to every event.
  contexts: {
    webPage: false,
    performanceTiming: false,
    gaCookies: false,
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
    return false
  },
}
