import { ErrorFactory } from '../error.factory.js'
export class BadRequest extends ErrorFactory {
  public readonly statusCode: number = 400
}
