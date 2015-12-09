// snowplow.js
//
// A nicer wrapper around the Snowplow.js library.

import internalSnowplow from './snowplow/bootstrap';
import snowplowConfig from './snowplow/config';
import { COLLECTOR_URI } from './config';
import { debug } from './messages';

// Initialise the tracker
internalSnowplow('newTracker', 'cf', COLLECTOR_URI, snowplowConfig);

// Wrap snowplow in a logging decorator.
export default (...args) => {
  debug(`snowplow: ${args}`);
  internalSnowplow(...args);
};
