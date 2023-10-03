import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum';
import { ErrorFactory } from '../error.factory.js';
export class ClientException extends ErrorFactory {
    statusCode = 417;
    constructor(message) {
        super(ErrorCode.CLIENT_EXCEPTION, ErrorDescription.CLIENT_EXCEPTION, message);
    }
}
//# sourceMappingURL=clientException.clientError.js.map