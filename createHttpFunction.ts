import type { Topic } from '@google-cloud/pubsub'
import type { EmailData } from '@suin/email-data'
import type { Request, Response } from 'express'
import { parseEmailData } from './parseEmailData'
import { FormData, parseFormData } from './parseFormData'
import { parseSendgridPayload, SendgridPayload } from './sendgridPayload'

export const createHttpFunction = ({
  topic,
  logger = defaultLogger,
}: Dependencies) => async (
  req: Pick<Request, 'method' | 'headers' | 'rawBody'>,
  res: Pick<Response, 'send' | 'end' | 'status'>,
): Promise<void> => {
  if (req.method !== 'POST') {
    return res.status(405).send('Only POST method is supported').end()
  }

  // Generate correlationId
  const correlationId = generateCorrelationId(req.headers, logger)
  logger.info(`CorrelationId generated: ${correlationId}`, { correlationId })

  // Parses form data
  let formData: FormData
  try {
    formData = await parseFormData(req)
  } catch (error) {
    logger.error('Failed to parse the form data', { error })
    return res.status(400).send(error.message).end()
  }
  logger.info(`Form data was parsed`)

  // Parses the SendGrid form data
  let sendgridPayload: SendgridPayload
  try {
    sendgridPayload = parseSendgridPayload(formData)
  } catch (error) {
    logger.error('Failed to parse the SendGrid form data', { error, formData })
    return res.status(400).send(error.message).end()
  }
  logger.info('SendGrid payload was parsed')

  // Parses the email
  let emailData: EmailData
  try {
    emailData = await parseEmailData(sendgridPayload.email)
  } catch (error) {
    logger.error('Failed to parse email source', {
      email: sendgridPayload.email,
    })
    return res.status(400).send(error.message).end()
  }
  logger.info('The email source was parsed')

  // Publishes email
  try {
    const event: Event = { correlationId, email: emailData }
    await topic.publish(Buffer.from(JSON.stringify(event), 'utf8'))
    logger.info(`Successfully published the email to topic ${topic.name}`)
  } catch (error) {
    logger.error(`Failed to publish the email to topic ${topic.name}`, {
      emailData,
    })
    res.status(500).send('Something wrong')
  }

  res.status(200).send('OK')
}

const generateCorrelationId = (
  headers: Request['headers'],
  logger: Logger,
): string => {
  const id = headers['function-execution-id']
  if (typeof id !== 'string') {
    logger.info('The request header is wrong', { headers, id })
    throw new Error(
      'function-execution-id header in the request is required and must be a single string value',
    )
  }
  return id
}

const defaultLogger: Logger = {
  error(message: string, meta?: unknown): void {
    console.error(JSON.stringify({ message, meta }))
  },
  info(message: string, meta?: unknown): void {
    console.info(JSON.stringify({ message, meta }))
  },
}

export type Dependencies = {
  readonly topic: Pick<Topic, 'publish' | 'name'>
  readonly logger?: Logger
}

export type Event = {
  readonly correlationId: string
  readonly email: EmailData
}

export type Logger = Pick<Console, 'info' | 'error'>
