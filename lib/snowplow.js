// Snowplow bootstrapping.
// Taken from https://github.com/snowplow/snowplow-javascript-tracker/blob/master/tags/tag.js

import { COLLECTOR_URI } from './config';
import snowplowConfig from './snowplow/config';

// `window[snowplowFunctionName]` will be given to Snowplow.
// Within ES6, take the export from this file instead.
const snowplowFunctionName = 'reevooSnowplow';

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

// Load the script into the window.
// (Snowplow is not ES6 friendly!)
require('script!../vendor/snowplow/2.5.3/sp.js');

// Initialise the tracker
window[snowplowFunctionName]('newTracker', 'cf', COLLECTOR_URI, snowplowConfig);

// Export the Snowplow access function.
export default window[snowplowFunctionName];
