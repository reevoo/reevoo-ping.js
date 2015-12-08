// events.js
//
// Event Catalogue.
//
// To add an event to the catalogue, look below the definition of `events`.
const events = {
  // All activated events. (To be constructed below.)
  dict: {},
  count: 0,
};

events.add = function add(event) {
  events.dict[event.name] = event;
  events.count += 1;
};

events.get = function get(eventName) {
  return events.dict[eventName];
};

// Let's start adding events!
// To add an event, copy/paste/adjust-to-taste the pair of lines below.
import pageViewed from './events/page/viewed';
events.add(pageViewed);

export default events;
