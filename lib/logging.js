// logging.js
//
// It's all about logging!

import { DEBUG } from './config';

export function debug(message) {
  if (DEBUG) {
    console.log(`[PING] ${message}`); // eslint-disable-line no-console
  }
}

export function error(message) {
  throw new Error(`[PING] ${message}`);
}
