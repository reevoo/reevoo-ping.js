import { COLLECTOR_URI } from '../lib/config'

describe('lib/config', () => {
  it('has settings available', () => {
    expect(COLLECTOR_URI).toBeDefined()
  })
})
