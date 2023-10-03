import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum'
import { ErrorFactory } from '../error.factory.js'
export class ClientException extends ErrorFactory {
  public readonly statusCode: number = 417
  constructor(message: string) {
    super(ErrorCode.CLIENT_EXCEPTION, ErrorDescription.CLIENT_EXCEPTION, message)
  }
}
