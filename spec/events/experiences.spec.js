import experiencesInjector from 'inject!lib/events/experiences';

describe('lib/events/experiences', () => {
  let experiences;
  let snowplow;

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow');
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
        filters: ['fakefilter_1', 'fakefilter_2'],
        open: true,
      };
    });

    it('calls Snowplow', () => {
      experiences.dockToggled(dockToggledParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('raises an error if client id is not supplied', () => {
      dockToggledParams.client_id = undefined;

      expect(() => {
        experiences.dockToggled(dockToggledParams);
      }).toThrowError(/Client id/);
    });

    it('raises an error if client id is not a valid UUID', () => {
      dockToggledParams.client_id = 'NOT_A_REAL_CLIENT_ID';

      expect(() => {
        experiences.dockToggled(dockToggledParams);
      }).toThrowError();
    });

    it('raises an error if filters is not supplied', () => {
      dockToggledParams.filters = undefined;

      expect(() => {
        experiences.dockToggled(dockToggledParams);
      }).toThrowError(/Filters/);
    });

    it('raises an error if open is not supplied', () => {
      dockToggledParams.open = undefined;

      expect(() => {
        experiences.dockToggled(dockToggledParams);
      }).toThrowError(/Open/);
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
