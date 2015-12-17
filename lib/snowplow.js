// snowplow.js
//
// A nicer wrapper around the Snowplow.js library.

import internalSnowplow from './snowplow/bootstrap';
import snowplowConfig from './snowplow/config';
import { COLLECTOR_URI } from './config';
import { debug } from './logging';

// Initialise the tracker
const trackerName = 'reevoo';
internalSnowplow('newTracker', trackerName, COLLECTOR_URI, snowplowConfig);

// Wrap snowplow in a logging decorator.
export default (...args) => {
  const asStrings = args.map(JSON.stringify);
  debug(`snowplow: ${asStrings}`);
  internalSnowplow(...args);
};
