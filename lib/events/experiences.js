// events.js
//
// User events on the experiences widget.

import snowplow from '../snowplow';
import validate from '../validate';

export default class Experiences {

  dockToggled(opts) {
    opts.fullDockToggledParams = JSON.stringify(opts);

    validate(opts, {
      client_id: { presence: true, format: /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/ },
      filters: { presence: true },
      open: { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/dock_toggled/jsonschema/1-0-0',
      data: opts,
    });
  }
}
