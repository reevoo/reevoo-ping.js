import stringify from 'json-stable-stringify'
import validate from '../validate'

const EVENT_TYPES = ['rendered', 'seen', 'clicked', 'scrolled']
const CONTENT_TYPES = ['product', 'brand', 'conversations', 'combo']
const EVENT_STATES = ['success', 'not_valid', 'error']
const CONTENT_SOURCES = ['lightbox', 'tabbed', 'standalone', 'badge', 'client_own']

function validationsForEvent() {
  return {
    eventType: {
      presence: true,
      inclusion: EVENT_TYPES,
    },
    eventState: {
      presence: false,
      inclusion: EVENT_STATES,
    },
    trkref: { presence: true },
    contentType: {
      presence: true,
      inclusion: CONTENT_TYPES,
    },
    contentSource: {
      presence: true,
      inclusion: CONTENT_SOURCES,
    },
    contentAttributes: { presence: false },
    metadata: { presence: false },
  }
}

function propertiesForEvent() {
  return Object.keys(validationsForEvent())
}

function snowplowData(eventProperties, additionalProperties) {
  return {
    ...eventProperties,
    trkref: eventProperties.trkref || this.trkref,
    contentAttributes: eventProperties.contentAttributes
      ? stringify(eventProperties.contentAttributes)
      : undefined,
    metadata: eventProperties.metadata
      ? stringify(eventProperties.metadata)
      : undefined,
    additionalProperties:
      Object.keys(additionalProperties).length > 0 ? stringify(additionalProperties) : undefined,
  }
}

export default class Widget {
  constructor(tracker, trkref) {
    this.tracker = tracker
    this.trkref = trkref
  }

  track(eventType, props) {
    const properties = propertiesForEvent()
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

    validate(data, validationsForEvent())
    this.tracker('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/widgets_event/jsonschema/1-0-0',
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

  scrolled(props) {
    this.track('scrolled', props)
  }
}
