// This hash is passed into the `newTracker` action.
export default {

  // Sent with events.
  appId: "reevoo-ping.js",

  // Enable cookie access across sub-domains.
  cookieDomain: '.reevoo.com',
  cookieName: "reevoo_snowplow",

  // Be nice.
  respectDoNotTrack: true,

  // Wait and send events before changing page.
  pageUnloadTimer: 100,

  // Conntect to the Collector via HTTPS only.
  forceSecureTracker: true,

  // Add contexts to every event.
  contexts: {
    webPage: true,
    performanceTiming: true,
    gaCookies: true
  },

  // Add cross-domain linking on all links.
  crossDomainLinker: function(linkElement) { 
    return linkElement.href.indexOf('javascript:') < 0; 
  },

};
