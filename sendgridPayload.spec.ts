import { parseSendgridPayload, SendgridPayload } from './sendgridPayload'

describe('parseSendgridPayload', () => {
  it('returns the value if the value is compatible with the SendgridPayload', () => {
    const value: SendgridPayload = { email: '' }
    expect(parseSendgridPayload(value)).toBe(value)
  })
  it('allows unknown additional keys', () => {
    const value: SendgridPayload = { email: '', unknownKey: '' }
    expect(parseSendgridPayload(value)).toBe(value)
  })
  it('throws an Error if the value is not compatible with the SendgridPayload', () => {
    const incompatibleValue: unknown = null
    expect(() => parseSendgridPayload(incompatibleValue)).toThrowError()
  })
})
