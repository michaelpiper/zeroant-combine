import { ErrorFactory } from '../error.factory.js'
export class UnprocessableEntity extends ErrorFactory {
  public readonly statusCode: number = 422
}
