// events.js
//
// User events on the experiences widget.

import validate from '../validate'

export default class Experiences {
  constructor(tracker) {
    this.tracker = tracker
  }

  dockToggled(opts) {
    // FIXME: should be like commented code below
    // eslint-disable-next-line no-param-reassign
    opts.fullDockToggledParams = JSON.stringify(opts)
    // const options = {
    //   ...opts,
    //   fullDockToggledParams: JSON.stringify(opts)
    // }

    validate(opts, {
      open: { presence: true },
      filters: { array: true },
    })

    this.tracker('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/dock_toggled/jsonschema/1-0-0',
      data: opts,
    })
  }
}
