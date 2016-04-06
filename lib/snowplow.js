// snowplow.js
//
// A nicer wrapper around the Snowplow.js library.

import internalSnowplow from './snowplow/bootstrap';
import { debug } from './logging';

// Wrap snowplow in a logging decorator.
export default (...args) => {
  const asStrings = args.map(JSON.stringify);
  debug(`snowplow: ${asStrings}`);
  internalSnowplow(...args);
};
