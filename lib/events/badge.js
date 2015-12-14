// badge.js
//
// Badge events.

import snowplow from '../snowplow';
import validate from '../validate';

export default class Badge {
  constructor(trkref) {
    this.trkref = trkref;
  }

  // To be triggered when a badge is rendered on the page.
  rendered(opts) {
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
  seen(opts) {
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
