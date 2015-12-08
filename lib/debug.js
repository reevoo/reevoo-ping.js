// debug.js
//
// In some modules we sometimes want extra information output to the console.
// This function ensure this doesn't happen on production.

import config from './config';

export default function debug(message) {
  if (config.DEBUG) {
    console.log(`[PING] ${message}`); // eslint-disable-line no-console
  }
}
