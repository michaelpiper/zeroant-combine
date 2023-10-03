import { ErrorFactory } from './error.factory.js'
import { type Middleware, type Context, type Next } from 'koa'
import { InternalServerError } from './serverErrors/internalServerError.serverError.js'
import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum'

export default (): Middleware => {
  return async (ctx: Context, next: Next) => {
    try {
      return await next()
    } catch (error) {
      if (error instanceof ErrorFactory) {
        return await reportCustomError(error, ctx)
      }
      return await reportCustomError(
        new InternalServerError(ErrorCode.UNHANDLED_EXCEPTION, ErrorDescription.UNHANDLED_EXCEPTION, '').withRootError(error as any),
        ctx
      )
    }
  }
}
const reportCustomError = async (err: ErrorFactory, ctx: Context): Promise<any> => {
  const { statusCode = 500 } = err
  ctx.status = statusCode
  ctx.body = err
  console.error(err._cause)
}
