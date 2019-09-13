import Experiences from '../../lib/events/experiences'

describe('lib/events/experiences', () => {
  let experiences
  let snowplow
  let consoleError

  function expectItReportsError(matchMessage) {
    expect(consoleError).toHaveBeenCalledWith(jasmine.stringMatching(matchMessage))
  }

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow')
    consoleError = spyOn(console, 'error')
    experiences = new Experiences(snowplow)
  })

  describe('.button_click', () => {
    let dockToggledParams

    beforeEach(() => {
      dockToggledParams = {
        open: true,
        filters: ['foo', 'bar'],
      }
    })

    it('calls Snowplow', () => {
      experiences.dockToggled(dockToggledParams)
      expect(snowplow).toHaveBeenCalled()
    })

    it('reports an error if open is not supplied', () => {
      dockToggledParams.open = undefined
      experiences.dockToggled(dockToggledParams)
      expectItReportsError('Open')
    })

    it('includes a JSON-encoded string of the options given', () => {
      const expectedJsonString = JSON.stringify(dockToggledParams)

      experiences.dockToggled(dockToggledParams)

      // payload.data.fullDockToggledParams contains our JSON string.
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            fullDockToggledParams: expectedJsonString,
          }),
        })
      )
    })
  })
})
