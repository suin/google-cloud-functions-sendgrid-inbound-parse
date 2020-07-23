import type { HttpFunction } from '@google-cloud/functions-framework/build/src/functions'
import { PubSub } from '@google-cloud/pubsub'
import { createHttpFunction } from './createHttpFunction'

const topic = process.env.TOPIC

if (typeof topic !== 'string') {
  throw new Error(`Env TOPIC is required`)
}

export const publishEmailDataOnSendgridInboundParse: HttpFunction = createHttpFunction(
  { topic: new PubSub().topic(topic) },
)
