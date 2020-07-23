import Busboy from 'busboy'
import type { Request } from 'express'

/**
 * Parses multipart/form-data request and returns the FormData
 */
export const parseFormData = ({
  headers,
  rawBody,
}: Pick<Request, 'headers' | 'rawBody'>): Promise<FormData> =>
  new Promise(resolve => {
    const fields: FormData = {}
    new Busboy({ headers })
      .on('field', (name, value) => void (fields[name] = value))
      .on('finish', () => resolve(fields))
      .end(rawBody)
  })

export type FormData = { [k: string]: string }
