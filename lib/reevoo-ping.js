// reevoo-ping.js
//
// Main event recording class.

import validate from './validate';
import snowplow from './snowplow';
import Page from './events/page';

class ReevooPing {
  constructor(opts) {
    validate(opts, {
      trkref: { presence: true },
    });

    this.page = new Page(snowplow);

    this.trkref = opts.trkref;
  }

  // To be triggered when a badge is rendered on the page.
  badgeRendered(opts) {
    opts.trkref = opts.trkref || this.trkref;

    validate(opts, {
      hit_type: { presence: true, inclusion: ['hit', 'miss', 'non_impression'] },
      badge_name: { presence: true },
      badge_type: { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_rendered/jsonschema/1-0-0', // TO BE DEFINED
      data: opts,
    });
  }

  // To be triggered when a badge enters the user's viewport. (Kinky.)
  badgeSeen(opts) {
    opts.trkref = opts.trkref || this.trkref;

    validate(opts, {
      badge_name: { presence: true },
      badge_type: { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_seen/jsonschema/1-0-0', // TO BE DEFINED
      data: opts,
    });
  }
}

window.ReevooPing = ReevooPing;
export default ReevooPing;
