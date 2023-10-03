import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum'
import { BadRequest } from './badRequest.clientError.js'
export class NotImplemented extends BadRequest {
  constructor(message: string) {
    super(ErrorCode.IMPLEMENTATION_EXCEPTION, ErrorDescription.IMPLEMENTATION_EXCEPTION, message)
  }
}
