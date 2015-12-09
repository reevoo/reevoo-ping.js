import event from 'lib/events/event';

describe('lib/event', () => {
  let validEvent;

  beforeEach(() => {
    validEvent = {
      name: 'event',
      attach: () => {},
      trigger: () => {},
      detach: () => {},
    };
  });

  it('allows creation of a valid event', () => {
    expect(() => { event(validEvent); }).not.toThrowError();
  });

  it('does not allow creation of an event without a name', () => {
    validEvent.name = undefined;
    expect(() => { event(validEvent); }).toThrowError(/name/);
  });

  it('does not allow creation of an event without an attach method', () => {
    validEvent.attach = undefined;
    expect(() => { event(validEvent); }).toThrowError(/attach/);
  });

  it('does not allow creation of an event without a trigger method', () => {
    validEvent.trigger = undefined;
    expect(() => { event(validEvent); }).toThrowError(/trigger/);
  });

  it('does not allow creation of an event without an a detach method', () => {
    validEvent.detach = undefined;
    expect(() => { event(validEvent); }).toThrowError(/detach/);
  });
});
