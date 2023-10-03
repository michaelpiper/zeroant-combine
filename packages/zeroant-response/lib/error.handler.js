import { ErrorFactory } from './error.factory.js';
import { InternalServerError } from './serverErrors/internalServerError.serverError.js';
import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum';
export default () => {
    return async (ctx, next) => {
        try {
            return await next();
        }
        catch (error) {
            if (error instanceof ErrorFactory) {
                return await reportCustomError(error, ctx);
            }
            return await reportCustomError(new InternalServerError(ErrorCode.UNHANDLED_EXCEPTION, ErrorDescription.UNHANDLED_EXCEPTION, '').withRootError(error), ctx);
        }
    };
};
const reportCustomError = async (err, ctx) => {
    const { statusCode = 500 } = err;
    ctx.status = statusCode;
    ctx.body = err;
    console.error(err._cause);
};
//# sourceMappingURL=error.handler.js.map