import { Request } from 'express'
declare module 'express' {
  interface Request {
    readonly rawBody: Buffer
  }
}
