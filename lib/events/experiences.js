// events.js
//
// User events on the experiences widget.

import snowplow from '../snowplow';
import validate from '../validate';

export default class Experiences {

  dockOpened(opts) {
    opts.fullDockOpenedParams = JSON.stringify(opts);

    validate(opts, {
      client_id: { presence: true, format: /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/ },
      filters: { presence: true },
    });

    snowplow('trackUnstructEvent', {
      schema: 'iglu:com.reevoo/dock_opened/jsonschema/1-0-0', // TO BE DEFINED
      data: opts,
    });
  }
}
