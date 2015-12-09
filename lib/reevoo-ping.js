// reevoo-ping.js
//
// Main entry point of ReevooPing.

require('./snowplow');
import eventCatalogue from './events';

const reevooPing = {
  // By default, track nothing.
  events: [],

  // Sets up the set of events that ReevooPing will track.
  //
  // This method is not additive; calling this twice (or calling `sendEventSet`)
  // will replace the list of tracked events!
  sendEventsWhen: (eventNames) => {
    reevooPing.clearEvents();
    reevooPing.events = eventNames.map(eventCatalogue.get);
    reevooPing.events.forEach(event => { event.attach(event.trigger); });
  },

  // Clear the event list, safely detach()'ing each event before clearing.
  clearEvents: () => {
    reevooPing.events.forEach(event => { event.detach(); });
    reevooPing.events = [];
  },

  // Sets up ReevooPing to track a named set of events.
  //
  // This method is not additive; calling this twice (or calling `sendEventSet`)
  // will replace the list of tracked events!
  // sendEventSet: function sendEventsWhen(eventSetName) {
  //   // TODO!
  // },
};

// We attach to the window.
// I know, naughty.
window.reevooPing = reevooPing;
export default window.reevooPing;
