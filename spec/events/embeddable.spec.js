import omit from 'object.omit'
import Embeddable from '../../lib/events/embeddable'

describe('lib/events/embeddable', () => {
  let embeddable
  let snowplow
  let consoleError

  function expectItReportsError(matchMessage) {
    expect(consoleError).toHaveBeenCalledWith(jasmine.stringMatching(matchMessage))
  }

  beforeEach(() => {
    snowplow = jasmine.createSpy('snowplow')
    consoleError = spyOn(console, 'error')
    embeddable = new Embeddable(snowplow)
  })

  describe('.track', () => {
    let embeddableEventParams

    beforeEach(() => {
      embeddableEventParams = {
        hitType: 'impression',
        trkref: 'TRKREF',
        reviewableContext: { sku: 'SKU' },
        contentType: 'product',
        implementation: 'standalone',
        averageScore: 9.2,
      }
    })

    it('calls Snowplow', () => {
      embeddable.rendered(embeddableEventParams)
      expect(snowplow).toHaveBeenCalledWith(
        'trackUnstructEvent',
        jasmine.objectContaining({
          schema: 'iglu:com.reevoo/embeddable_event/jsonschema/1-0-0',
          data: jasmine.objectContaining({
            ...omit(embeddableEventParams, 'averageScore', 'reviewableContext'),
            eventType: 'rendered',
            reviewableContext: '{"sku":"SKU"}',
            additionalProperties: '{"averageScore":9.2}',
          }),
        })
      )
    })

    it('reports an error if hit type is not valid', () => {
      embeddableEventParams.hitType = 'NOT_A_REAL_HIT_TYPE'
      embeddable.rendered(embeddableEventParams)
      expectItReportsError(/not included in the list/)
    })

    it('reports an error if content type is not supplied', () => {
      embeddableEventParams.contentType = undefined
      embeddable.rendered(embeddableEventParams)
      expectItReportsError(/Content type/)
    })

    it('reports an error if content type is not valid', () => {
      embeddableEventParams.contentType = 'NOT_A_REAL_CONTENT_TYPE'
      embeddable.rendered(embeddableEventParams)
      expectItReportsError(/not included in the list/)
    })

    it('reports an error if trkref is not supplied', () => {
      embeddableEventParams.trkref = undefined
      embeddable.rendered(embeddableEventParams)
      expectItReportsError(/Trkref/)
    })

    it('uses TRKREF from the root scope when not provided as argument', () => {
      embeddableEventParams.trkref = undefined
      embeddable = new Embeddable(snowplow, 'MY_TRKREF')

      embeddable.rendered(embeddableEventParams)
      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            trkref: 'MY_TRKREF',
          }),
        })
      )
    })

    it('sorts and stringifies reviewable context', () => {
      embeddable.rendered({
        ...embeddableEventParams,
        reviewableContext: { model: 'Focus', manufacturer: 'Ford' },
      })

      expect(snowplow).toHaveBeenCalledWith(
        jasmine.anything(),
        jasmine.objectContaining({
          data: jasmine.objectContaining({
            reviewableContext: '{"manufacturer":"Ford","model":"Focus"}',
          }),
        })
      )
    })
  })

  describe('shortcut methods', () => {
    const testParams = { foo: 'bar ' }

    ;['rendered', 'seen', 'clicked'].forEach((eventType) => {
      describe(`.${eventType}`, () => {
        it('calls track method', () => {
          const trackMethod = spyOn(embeddable, 'track')
          embeddable[eventType](testParams)
          expect(trackMethod).toHaveBeenCalledWith(eventType, testParams)
        })
      })
    })
  })
})
