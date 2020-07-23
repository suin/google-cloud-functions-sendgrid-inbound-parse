import * as z from 'zod'

/**
 * SendGrid Inbound Parse payload schema
 *
 * @see https://sendgrid.com/docs/for-developers/parsing-email/setting-up-the-inbound-parse-webhook/#raw-parameters
 */
const payloadSchema = z
  .object({
    email: z.string(),
  })
  .nonstrict()

/**
 * SendGrid Inbound Parse payload interface
 */
export type SendgridPayload = z.infer<typeof payloadSchema>

/**
 * Returns the value as the type SendGridPayload if it is compatible with the
 * type SendGridPayload, otherwise throws an Error.
 * @throws Error
 */
export const parseSendgridPayload = (value: unknown): SendgridPayload =>
  payloadSchema.parse(value)
