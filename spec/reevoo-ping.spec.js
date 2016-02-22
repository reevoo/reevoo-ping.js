import ReevooPing from 'lib/reevoo-ping';

describe('lib/reevoo-ping', () => {
  it('defines ReevooPing', () => {
    expect(ReevooPing).toBeDefined();
  });

  describe('.constructor', () => {
    it('returns object with valid options', () => {
      expect(() => {
        new ReevooPing.Client({ trkref: 'TRKREF' }); // eslint-disable-line no-new
      }).not.toThrowError();
    });
  });

  let ping;
  beforeEach(() => {
    ping = new ReevooPing.Client({ trkref: 'TRKREF' });
  });

  it('has page events', () => {
    expect(ping.page).toBeDefined();
  });

  it('has badge events', () => {
    expect(ping.page).toBeDefined();
  });
});
