// viewed.js
//
// Event triggered when a page is viewed.

import event from '../event';
import snowplow from '../../snowplow';

export default event({
  name: 'page viewed',
  attach: (trigger) => { trigger(); }, // Fire immediately!
  trigger: () => { snowplow('trackPageView'); },
  detach: () => {}, // Only fires once; cannot detach!
});
