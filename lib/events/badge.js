// badge.js
//
// Badge events.

import stringify  from 'json-stable-stringify';
import snowplow   from '../snowplow';
import validate   from '../validate';

const EVENT_TYPES     = ['rendered', 'seen'];
const CONTENT_TYPES   = ['reviewable', 'customer_experience', 'conversations'];
const HIT_TYPES       = ['impression', 'non_impression', 'miss'];
const CTA_PAGE_USES   = ['single_reviewable', 'multi_reviewable'];
const IMPLEMENTATIONS = ['link', 'custom_element'];

const VALIDATIONS = {
  eventType:          { presence: true, inclusion: EVENT_TYPES },
  contentType:        { presence: true, inclusion: CONTENT_TYPES },
  hitType:            { presence: true, inclusion: HIT_TYPES },
  ctaPageUse:         { presence: true, inclusion: CTA_PAGE_USES },
  implementation:     { presence: true, inclusion: IMPLEMENTATIONS },
  trkref:             { presence: true },
  ctaStyle:           { presence: false },
  reviewableContext:  { presence: false },
};
const PROPERTIES = Object.keys(VALIDATIONS);

// To maintain backward compatibility we try to determine CTA page use when not provided.
function determineCtaPageUse(opts) {
  // It's "multi_reviewable" when badgeVariant value contains term "category" or "listing"
  if (opts.badgeVariant && opts.badgeVariant.match(/category|listing/)) return 'multi_reviewable';
  return 'single_reviewable';
}

// To maintain backward compatibility we try to determine CTA style when not provided.
function determineCtaStyle(opts) {
  return opts.badgeName || opts.badgeVariant;
}

function snowplowData(that, eventProperties, additionalProperties) {
  return {
    ...eventProperties,
    trkref:               eventProperties.trkref || that.trkref,
    ctaPageUse:           eventProperties.ctaPageUse || determineCtaPageUse(additionalProperties),
    ctaStyle:             eventProperties.ctaStyle || determineCtaStyle(additionalProperties),
    reviewableContext:    eventProperties.reviewableContext ? stringify(eventProperties.reviewableContext) : null,
    additionalProperties: (Object.keys(additionalProperties).length > 0) ? stringify(additionalProperties) : null,
  };
}

function badgeEvent(that, eventType, props) {
  const eventProperties = { eventType };
  const additionalProperties = {};

  for (const prop in props) {
    if (PROPERTIES.indexOf(prop) === -1) {
      additionalProperties[prop] = props[prop];
    } else {
      eventProperties[prop] = props[prop];
    }
  }

  const data = snowplowData(that, eventProperties, additionalProperties);

  validate(data, VALIDATIONS);

  snowplow('trackUnstructEvent', {
    schema: 'iglu:com.reevoo/badge_event/jsonschema/1-0-0',
    data:   data,
  });
}


export default class Badge {
  constructor(trkref) {
    this.trkref = trkref;
  }

  // To be triggered when a badge is rendered on the page.
  rendered(props) {
    badgeEvent(this, 'rendered', props);
  }

  // To be triggered when a badge enters the user's viewport. (Kinky.)
  seen(props) {
    badgeEvent(this, 'seen', props);
  }

}
