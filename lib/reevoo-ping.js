// reevoo-ping.js
//
// Main event recording class.

import validate from './validate';
import Page from './events/page';
import Badge from './events/badge';

class ReevooPing {
  constructor(opts) {
    validate(opts, {
      trkref: { presence: true },
    });

    this.page = new Page();
    this.badge = new Badge(opts.trkref);
  }
}

window.ReevooPing = ReevooPing;
export default ReevooPing;
