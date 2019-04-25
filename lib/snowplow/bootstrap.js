// bootstrap.js
//
// Load Snowplow into the window.
// Adapted from https://github.com/snowplow/snowplow-javascript-tracker/blob/master/tags/tag.js

import { debug } from '../logging';

// We could use `window[snowplowFunctionName]` everywhere, but that's not very ES6.
// Take the export instead.
//
// (This const is exported for testing.)
export const snowplowFunctionName = 'reevooSnowplow';

// Bootstrap!
if (!window[snowplowFunctionName]) {
  // Initialise the 'GlobalSnowplowNamespace' array
  window.GlobalSnowplowNamespace = window.GlobalSnowplowNamespace || [];

  // Add the new Snowplow namespace to the global array so sp.js can find it
  window.GlobalSnowplowNamespace.push(snowplowFunctionName);

  // Create the Snowplow function
  window[snowplowFunctionName] = function snowplow() {
    (window[snowplowFunctionName].q = window[snowplowFunctionName].q || []).push(arguments);
  };

  // Initialise the asynchronous queue
  window[snowplowFunctionName].q = window[snowplowFunctionName].q || [];
}

// Say hello!
window[snowplowFunctionName](function helloWorld() {
  debug('snowplow initialized');
});

// Load the script into the window.
// (Snowplow is not ES6 friendly!)
require('script!../../vendor/snowplow/2.10.2/sp.js');

// Export the Snowplow access function.
export default window[snowplowFunctionName];
