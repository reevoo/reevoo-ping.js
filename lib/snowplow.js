// snowplow.js
//
// A nicer wrapper around the Snowplow.js library.

import snowplow from './snowplow/bootstrap';
import snowplowConfig from './snowplow/config';
import { COLLECTOR_URI } from './config';
import { debug } from './logging';

// Initialise the tracker
snowplow('newTracker', 'cf', config.COLLECTOR_URI, snowplowConfig);

// Wrap snowplow in a logging decorator.
export default (...args) => {
  debug(`snowplow: ${args}`);
  snowplow(...args);
};
