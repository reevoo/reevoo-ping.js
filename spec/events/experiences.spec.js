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
    let dockOpenedParams;

    beforeEach(() => {
      dockOpenedParams = {
        client_id: '72f3b8f7-05c6-4cc0-8d43-b72d1a656899',
        filters: ['fakefilter_1', 'fakefilter_2'],
      };
    });

    it('calls Snowplow', () => {
      experiences.dockOpened(dockOpenedParams);
      expect(snowplow).toHaveBeenCalled();
    });

    it('raises an error if client id is not supplied', () => {
      dockOpenedParams.client_id = undefined;

      expect(() => {
        experiences.dockOpened(dockOpenedParams);
      }).toThrowError(/Client id/);
    });

    it('raises an error if client id is not a valid UUID', () => {
      dockOpenedParams.client_id = 'NOT_A_REAL_CLIENT_ID';

      expect(() => {
        experiences.dockOpened(dockOpenedParams);
      }).toThrowError();
    });

    it('raises an error if filters is not supplied', () => {
      dockOpenedParams.filters = undefined;

      expect(() => {
        experiences.dockOpened(dockOpenedParams);
      }).toThrowError(/Filters/);
    });

    it('includes a JSON-encoded string of the options given', () => {
      const expectedJsonString = JSON.stringify(dockOpenedParams);

      experiences.dockOpened(dockOpenedParams);

      // payload.data.fullDockOpenedParams contains our JSON string.
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            fullDockOpenedParams: expectedJsonString,
          }),
        })
      );
    });
  });
});
