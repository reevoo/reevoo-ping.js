// logging.js
//
// It's all about logging!

import { DEBUG } from './config';

export function debug(...args) {
  if ((DEBUG || window.location.search.match(/reevoo_debug=/)) && window.console) {
    console.debug('[reevoo-ping]', ...args);
  }
}

export function error(message) {
  throw new Error(`[PING] ${message}`);
}
