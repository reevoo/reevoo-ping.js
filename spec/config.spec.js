import config from 'lib/config';

describe('lib/config', () => {
  it('has a COLLECTOR_URI', () => {
    expect(config.COLLECTOR_URI).toBeDefined();
  });
});
