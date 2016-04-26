import experiencesInjector from 'inject!lib/events/experiences';

describe('lib/events/experiences', () => {
  let experiences;
  let snowplow;
  let consoleError;

  function expectItReportsError(matchMessage) {
    expect(consoleError).toHaveBeenCalledWith(jasmine.stringMatching(matchMessage));
  }


  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
    consoleError = spyOn(console, 'error');
    const Experiences = experiencesInjector({
      '../snowplow': snowplow,
    }).default;
    experiences = new Experiences();
  });

  describe('.button_click', () => {
    let dockToggledParams;

    beforeEach(() => {
      dockToggledParams = {
        client_id: '72f3b8f7-05c6-4cc0-8d43-b72d1a656899',
        open: true,
        filters: ['foo', 'bar'],
      };
    });

    it('calls Snowplow', () => {
      experiences.dockToggled(dockToggledParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('reports an error if client id is not supplied', () => {
      dockToggledParams.client_id = undefined;
      experiences.dockToggled(dockToggledParams);
      expectItReportsError('Client id');
    });

    it('reports an error if client id is not a valid UUID', () => {
      dockToggledParams.client_id = 'NOT_A_REAL_CLIENT_ID';
      experiences.dockToggled(dockToggledParams);
      expectItReportsError('Client id');
    });

    it('reports an error if open is not supplied', () => {
      dockToggledParams.open = undefined;
      experiences.dockToggled(dockToggledParams);
      expectItReportsError('Open');
    });

    it('includes a JSON-encoded string of the options given', () => {
      const expectedJsonString = JSON.stringify(dockToggledParams);

      experiences.dockToggled(dockToggledParams);

      // payload.data.fullDockToggledParams contains our JSON string.
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            fullDockToggledParams: expectedJsonString,
          }),
        })
      );
    });
  });
});
