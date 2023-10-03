import { ErrorFactory } from '../error.factory.js'
export class Unauthorized extends ErrorFactory {
  public readonly statusCode: number = 401
}
