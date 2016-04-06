import config from 'lib/snowplow/default-config';

describe('lib/snowplow/default-config', () => {
  it('is simple enough not to have tests', () => {
    expect(config).toBeDefined();
  });
});
