// badge.js
//
// Badge events.

import stringify from 'json-stable-stringify'
import validate from '../validate'

const EVENT_TYPES = ['purchase', 'checkout', 'propensity_to_buy']

function validationsForEventType(/* eventType */) {
  return {
    eventType: { presence: true, inclusion: EVENT_TYPES },
    trkref: { presence: true },
    reviewableContext: { presence: false },
  }
}

function propertiesForEventType(eventType) {
  return Object.keys(validationsForEventType(eventType))
}

function snowplowData(that, eventProperties, additionalProperties) {
  return {
    ...eventProperties,
    trkref: eventProperties.trkref || that.trkref,
    reviewableContext: eventProperties.reviewableContext
      ? stringify(eventProperties.reviewableContext)
      : undefined,
    additionalProperties:
      Object.keys(additionalProperties).length > 0 ? stringify(additionalProperties) : undefined,
  }
}

export default class Conversion {
  constructor(tracker, trkref) {
    this.tracker = tracker
    this.trkref = trkref
  }

  track(eventType, props) {
    const properties = propertiesForEventType(eventType)
    const eventProperties = { eventType }
    const additionalProperties = {}

    Object.keys(props).forEach((prop) => {
      if (properties.indexOf(prop) === -1) {
        additionalProperties[prop] = props[prop]
      } else {
        eventProperties[prop] = props[prop]
      }
    })

    const data = snowplowData(this, eventProperties, additionalProperties)

    validate(data, validationsForEventType(eventType))

    this.tracker('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/conversion_event/jsonschema/1-0-0',
      data,
    })
  }

  // Shortcut methods:

  purchase(props) {
    this.track('purchase', props)
  }

  checkout(props) {
    this.track('checkout', props)
  }

  propensityToBuy(props) {
    this.track('propensity_to_buy', props)
  }
}
