import snowplow from '../../lib/snowplow/bootstrap'

describe('lib/snowplow/bootstrap', () => {
  describe('after it is required', () => {
    it('defines the GlobalSnowplowNamespace', () => {
      expect(window.GlobalSnowplowNamespace).toBeDefined()
    })
  })

  describe('export', () => {
    it('exports a function', () => {
      expect(snowplow).toBeDefined()
    })

    it('exports an asynchronous Snowplow function', () => {
      expect(snowplow.q).toBeDefined()
    })
  })
})
