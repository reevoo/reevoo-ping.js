import 'lib/reevoo-ping';

describe('Reevoo ping', () => {
  it('the truth', () => {
    expect(true).toBe(true);
  });

  it('defines reevooPing', () => {
    expect(window.reevooPing).toBeDefined();
  });
});
