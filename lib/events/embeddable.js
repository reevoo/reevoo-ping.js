import stringify from 'json-stable-stringify'
import validate from '../validate'

const EVENT_TYPES = ['rendered', 'seen', 'clicked']
const CONTENT_TYPES = ['product', 'brand', 'ask_an_owner']
const HIT_TYPES = ['impression', 'non_impression', 'miss']
const IMPLEMENTATIONS = ['standalone', 'tabbed']

function validationsForEventType(/* eventType */) {
  return {
    eventType: {
      presence: true,
      inclusion: EVENT_TYPES,
    },
    contentType: {
      presence: true,
      inclusion: CONTENT_TYPES,
    },
    hitType: {
      presence: false,
      inclusion: HIT_TYPES,
    },
    implementation: {
      presence: true,
      inclusion: IMPLEMENTATIONS,
    },
    trkref: { presence: true },
    reviewableContext: { presence: false },
  }
}

function propertiesForEventType(eventType) {
  return Object.keys(validationsForEventType(eventType))
}

function snowplowData(eventProperties, additionalProperties) {
  return {
    ...eventProperties,
    trkref: eventProperties.trkref || this.trkref,
    reviewableContext: eventProperties.reviewableContext
      ? stringify(eventProperties.reviewableContext)
      : undefined,
    additionalProperties:
      Object.keys(additionalProperties).length > 0 ? stringify(additionalProperties) : undefined,
  }
}

export default class Embeddable {
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

    const data = snowplowData.call(this, eventProperties, additionalProperties)

    validate(data, validationsForEventType(eventType))

    this.tracker('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/embeddable_event/jsonschema/1-0-0',
      data,
    })
  }

  // To be triggered when a badge is rendered on the page.
  rendered(props) {
    this.track('rendered', props)
  }

  // To be triggered when a badge enters the user's viewport. (Kinky.)
  seen(props) {
    this.track('seen', props)
  }

  // To be triggered when a badge is clicked.
  clicked(props) {
    this.track('clicked', props)
  }
}
