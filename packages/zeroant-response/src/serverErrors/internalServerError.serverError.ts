import { ErrorFactory } from '../error.factory.js'
export class InternalServerError extends ErrorFactory {
  statusCode = 500
}
