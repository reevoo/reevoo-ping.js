// event.js
//
// An event is triggered when certain conditions are met.
// When an Event is triggered, it will be tracked.
//
// name = string
//   The name of the event to send.
//
// attach = function(trigger) { ... }
//   A function used to let the event listen for its trigger.
//   trigger should be called when the event conditions are met.
//
// trigger = function(params) { ... }
//   A function called when the event conditions are met.
export default function event(opts) {
  if (!opts.name) {
    throw new Error(`Event defined without a name!\n${opts}`);
  }

  if (!opts.attach) {
    throw new Error(`Event ${opts.name} defined without an attach() method!`);
  }

  if (!opts.trigger) {
    throw new Error(`Event ${opts.name} defined without a trigger() method!`);
  }

  if (!opts.detach) {
    throw new Error(`Event ${opts.name} defined without a detach() method!`);
  }

  return {
    name: opts.name,
    attach: opts.attach,
    trigger: opts.trigger,
    detach: opts.detach,
  };
}
