import snowplow from '../lib/snowplow'

describe('lib/snowplow', () => {
  let internalSnowplow
  let debug

  beforeEach(() => {
    internalSnowplow = jasmine.createSpy('internalSnowplow')
    debug = jasmine.createSpy('debug')
    // eslint-disable-next-line no-underscore-dangle
    snowplow.__set__('internalSnowplow', internalSnowplow)
    // eslint-disable-next-line no-underscore-dangle
    snowplow.__set__('debug', debug)
  })

  describe('export', () => {
    it('exports a function', () => {
      expect(snowplow).toBeDefined()
    })
  })

  it('logs to debug when called', () => {
    snowplow('test')
    expect(debug).toHaveBeenCalled()
  })

  it('calls internal snowplow when called', () => {
    snowplow('test')
    expect(internalSnowplow).toHaveBeenCalledWith('test')
  })
})
