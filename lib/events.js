// events.js
//
// Event Catalogue.
//
// To add an event to the catalogue, look below the definition of `events`.
import { error } from './messages';

const events = {
  // All activated events. (To be constructed below.)
  dict: {},
  count: 0,
};

events.add = function add(event) {
  events.dict[event.name] = event;
  events.count += 1;
};

// Gets an event by name. Throws an error if not found.
events.get = function get(eventName) {
  const event = events.dict[eventName];
  if (!event) { error(`Event not recognised: ${eventName}`); }
  return event;
};

// Let's start adding events!
// To add an event, copy/paste/adjust-to-taste the pair of lines below.
import pageViewed from './events/page/viewed';
events.add(pageViewed);

export default events;
