// badge.js
//
// Badge events.

import stringify  from 'json-stable-stringify';
import omit       from 'object.omit';
import snowplow   from '../snowplow';
import validate   from '../validate';

const CONTENT_TYPES       = ['reviewable', 'customer_experience', 'conversations'];
const HIT_TYPES           = ['impression', 'non_impression', 'miss'];
const CTA_PAGE_USES       = ['single_reviewable', 'multi_reviewable'];

// To maintain backward compatibility we try to determine CTA page use when not provided.
function determineCtaPageUse(opts) {
  if (opts.ctaPageUse) return opts.ctaPageUse;
  // It's "multi_reviewable" when badgeVariant value contains term "category" or "listing"
  if (opts.badgeVariant && opts.badgeVariant.match(/category|listing/)) return 'multi_reviewable';
  return 'single_reviewable';
}

// To maintain backward compatibility we try to determine CTA style when not provided.
function determineCtaStyle(opts) {
  return opts.ctaStyle || opts.badgeName || opts.badgeVariant;
}


export default class Badge {
  constructor(trkref) {
    this.trkref = trkref;
  }

  // To be triggered when a badge is rendered on the page.
  rendered(opts) {
    opts.trkref     = opts.trkref || this.trkref;
    opts.ctaPageUse = determineCtaPageUse(opts);
    opts.ctaStyle   = determineCtaStyle(opts);

    if (opts.reviewableContext) opts.reviewableContext = stringify(opts.reviewableContext);

    validate(opts, {
      contentType: { presence: true, inclusion: CONTENT_TYPES },
      hitType:     { presence: true, inclusion: HIT_TYPES },
      ctaPageUse:  { presence: true, inclusion: CTA_PAGE_USES },
      trkref:      { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_rendered/jsonschema/2-0-0',
      data:   opts,
    });
  }

  // To be triggered when a badge enters the user's viewport. (Kinky.)
  seen(opts) {
    opts.trkref = opts.trkref || this.trkref;

    validate(opts, {
      badge_type: { presence: true },
      trkref:     { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/badge_seen/jsonschema/1-0-0', // TO BE DEFINED
      data:   opts,
    });
  }

}
