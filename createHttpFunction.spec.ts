import { isEmailData } from '@suin/email-data'
import FormData from 'form-data'
import MockExpressRequest from 'mock-express-request'
import MockExpressResponse from 'mock-express-response'
import MailComposer from 'nodemailer/lib/mail-composer'
import Mail from 'nodemailer/lib/mailer'
import { createHttpFunction, Dependencies, Logger } from './createHttpFunction'

describe('createHttpFunction', () => {
  const mutedLogger: Logger = {
    info: () => {},
    error: () => {},
  }
  let publishedEvents: any[]
  const topicStub: Dependencies['topic'] = {
    name: 'topic-name',
    publish: async (event: Buffer) => {
      publishedEvents.push(JSON.parse(event.toString()))
      return '' // do nothing
    },
  }
  const publishEmailOnSendGridInboundParse = createHttpFunction({
    topic: topicStub,
    logger: mutedLogger,
  })

  beforeEach(() => {
    publishedEvents = []
  })

  it('responds status 405 if the method is not POST', async () => {
    const req = new MockExpressRequest({ method: 'GET' })
    const res = new MockExpressResponse()
    await publishEmailOnSendGridInboundParse(req, res)
    expect(res.statusCode).toBe(405)
  })

  it('responds status 200 if it is successful', async () => {
    const form = await createSendGridFormData({
      to: 'to@example.com',
      from: 'from@example.com',
      subject: 'subject',
      text: 'Hello',
    })
    const req = new MockExpressRequest({
      method: 'POST',
      headers: { 'function-execution-id': 'dummy-id', ...form.getHeaders() },
      rawBody: form.getBuffer(),
    })
    const res = new MockExpressResponse()
    await publishEmailOnSendGridInboundParse(req, res)
    expect(res.statusCode).toBe(200)
  })

  it('publishes an event', async () => {
    const form = await createSendGridFormData({
      to: 'to@example.com',
      from: 'from@example.com',
      subject: 'subject',
      text: 'Hello',
    })
    const req = new MockExpressRequest({
      method: 'POST',
      headers: { 'function-execution-id': 'dummy-id', ...form.getHeaders() },
      rawBody: form.getBuffer(),
    })
    const res = new MockExpressResponse()
    await publishEmailOnSendGridInboundParse(req, res)
    const [event] = publishedEvents
    expect(event.correlationId).toBe('dummy-id')
    expect(isEmailData(event.data)).toBe(true)
  })
})

const createSendGridFormData = async (
  mailOptions: Mail.Options,
): Promise<FormData> => {
  const form = new FormData()
  form.append(
    'email',
    (await new MailComposer(mailOptions).compile().build()).toString(),
  )
  return form
}
