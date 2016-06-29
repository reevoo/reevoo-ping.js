// events.js
//
// User events on the experiences widget.

import validate from '../validate';

export default class Experiences {
  constructor(tracker) {
    this.tracker = tracker;
  }

  dockToggled(opts) {
    opts.fullDockToggledParams = JSON.stringify(opts);

    validate(opts, {
      open: { presence: true },
      filters: { array: true },
    });

    this.tracker('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/dock_toggled/jsonschema/1-0-0',
      data: opts,
    });
  }
}
