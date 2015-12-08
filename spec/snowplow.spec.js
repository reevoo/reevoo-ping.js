import snowplow from 'lib/snowplow';

describe('lib/snowplow', () => {
  describe('after it is required', () => {
    it('adds a newTracker event to the snowplow queue', () => {
      pending('I don\'t know how to inspect the Snowplow Q!');
    });
  });

  describe('export', () => {
    it('exports a function', () => {
      expect(snowplow).toBeDefined();
    });
  });
});
