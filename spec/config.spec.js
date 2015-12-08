import config from 'lib/config';

describe('lib/config', () => {
  it('has settings available', () => {
    expect(config.COLLECTOR_URI).toBeDefined();
  });
});
