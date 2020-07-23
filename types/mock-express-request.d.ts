declare module 'mock-express-request' {
  import { Request } from 'express'
  class MockExpressRequest implements Request {
    constructor(
      options?: Partial<
        Pick<
          Request,
          'method' | 'headers' | 'url' | 'query' | 'params' | 'rawBody'
        >
      >,
    ) {}
  }
  interface MockExpressRequest extends Request {}
  export = MockExpressRequest
}
