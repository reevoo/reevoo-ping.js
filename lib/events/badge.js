// badge.js
//
// Badge events.

import snowplow from '../snowplow';
import validate from '../validate';

// The valid values of the hit_type parameter.
const VALID_HIT_TYPES = ['hit', 'miss', 'impression', 'non_impression'];

export default class Badge {
  constructor(trkref) {
    this.trkref = trkref;
  }

  // To be triggered when a badge is rendered on the page.
  rendered(opts) {
    opts.trkref = opts.trkref || this.trkref;

    validate(opts, {
      hit_type: { presence: true, inclusion: VALID_HIT_TYPES },
      badge_type: { presence: true },
      trkref: { presence: true },
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
      badge_type: { presence: true },
      trkref: { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_seen/jsonschema/1-0-0', // TO BE DEFINED
      data: opts,
    });
  }

}
