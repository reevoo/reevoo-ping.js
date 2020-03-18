import omit from 'object.omit'
import Widgets from '../../lib/events/widgets'

describe('lib/events/widgets', () => {
  let widgets
  let snowplow
  let consoleError
  let widgetsEventParams

  function expectItReportsError(matchMessage) {
    expect(consoleError).toHaveBeenCalledWith(jasmine.stringMatching(matchMessage))
  }

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow')
    consoleError = spyOn(console, 'error')
    widgets = new Widgets(snowplow)
    widgetsEventParams = {
      eventState: 'success',
      trkref: 'TRKREF',
      contentType: 'product',
      contentAttributes: { sku: 'SKU' },
      metadata: { averageScore: 9.2 },
    }
  })

  describe('.track', () => {

    it('calls Snowplow', () => {
      widgets.rendered(widgetsEventParams)
      expect(snowplow).toHaveBeenCalledWith(
        'trackUnstructEvent',
        jasmine.objectContaining({
          schema: 'iglu:com.reevoo/widgets_event/jsonschema/1-0-2',
          data: jasmine.objectContaining({
            ...omit(widgetsEventParams, 'contentAttributes'),
            eventType: 'rendered',
            contentAttributes: '{"sku":"SKU"}',
            metadata: '{"averageScore":9.2}',
          }),
        })
      )
    })

    it('reports an error if event state is not valid', () => {
      widgetsEventParams.eventState = 'NOT_A_REAL_HIT_TYPE'
      widgets.rendered(widgetsEventParams)
      expectItReportsError(/not included in the list/)
    })

    it('reports an error if content type is not supplied', () => {
      widgetsEventParams.contentType = undefined
      widgets.rendered(widgetsEventParams)
      expectItReportsError(/Content type/)
    })

    it('reports an error if content type is not valid', () => {
      widgetsEventParams.contentType = 'NOT_A_REAL_CONTENT_TYPE'
      widgets.rendered(widgetsEventParams)
      expectItReportsError(/not included in the list/)
    })

    it('reports an error if trkref is not supplied', () => {
      widgetsEventParams.trkref = undefined
      widgets.rendered(widgetsEventParams)
      expectItReportsError(/Trkref/)
    })

    it('uses TRKREF from the root scope when not provided as argument', () => {
      widgetsEventParams.trkref = undefined
      widgets = new Widgets(snowplow, 'MY_TRKREF')

      widgets.rendered(widgetsEventParams)
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            trkref: 'MY_TRKREF',
          }),
        })
      )
    })

    it('sorts and stringifies content attributes', () => {
      widgets.rendered({
        ...widgetsEventParams,
        contentAttributes: { model: 'Focus', manufacturer: 'Ford' },
      })

      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            contentAttributes: '{"manufacturer":"Ford","model":"Focus"}',
          }),
        })
      )
    })
  })

  describe('shortcut methods', () => {
    ;['rendered', 'updated', 'seen', 'clicked', 'scrolled'].forEach((eventType) => {
      describe(`.${eventType}`, () => {
        it('calls track method', () => {
          const trackMethod = spyOn(widgets, 'track')
          widgets[eventType](widgetsEventParams)
          expect(trackMethod).toHaveBeenCalledWith(eventType, widgetsEventParams)
        })
      })
    })
  })
})
