// debug.js
//
// In some modules we sometimes want extra information output to the console.
// This function ensure this doesn't happen on production.

import { DEBUG } from './config';

// To be used for debug messages.
// Checks the config to see if debug messages are enabled.
export function debug(message) {
  if (DEBUG) {
    console.log(`[PING] ${message}`); // eslint-disable-line no-console
  }
}

// Throw an error.
// TODO: Maybe we want to do something else?
export function error(message) {
  throw new Error(`[PING] ${message}`);
}
