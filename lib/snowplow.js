// snowplow.js
//
// A nicer wrapper around the Snowplow.js library.

import internalSnowplow from './snowplow/bootstrap';
import { debug } from './logging';

// Wrap snowplow in a logging decorator.
export default (...args) => {
  const isDryRun = window.location.search.match(/reevoo_dry_run=/);
  debug('call snowplow', ...args);
  if (!isDryRun) internalSnowplow(...args);
};
