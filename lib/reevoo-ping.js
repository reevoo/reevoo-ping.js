// reevoo-ping.js
//
// Main event recording class.

import validate from './validate';
import Page from './events/page';
import Badge from './events/badge';

class Client {
  constructor(opts) {
    validate(opts, {
      trkref: { presence: true },
    });

    this.page = new Page();
    this.badge = new Badge(opts.trkref);
  }
}

// This allows the in-script usage:
//   var x = new window.ReevooPing.Client(...);
export { Client };

// This allows ES6 module usage:
//   import ReevooPing from 'reevoo-ping.js';
//   const ping = new ReevooPing.Client(...);
export default { Client };
