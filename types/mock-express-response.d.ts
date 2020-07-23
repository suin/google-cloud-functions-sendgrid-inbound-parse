declare module 'mock-express-response' {
  import { Response } from 'express'
  class MockExpressResponse implements Response {}
  interface MockExpressResponse extends Response {}
  export = MockExpressResponse
}
