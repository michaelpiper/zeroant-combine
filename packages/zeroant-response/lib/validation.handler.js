import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum';
import joi from 'joi';
import lodash from 'lodash';
import { UnprocessableEntity } from './clientErrors/unprocessableEntity.clientError.js';
export default (validation, options) => {
    const { sources = [], ...opts } = options ?? {};
    const dataSources = sources ?? [];
    return async (ctx, next) => {
        try {
            const sourceData = {};
            for (const source of dataSources) {
                const data = getDataSource(ctx, source);
                lodash.merge(sourceData, data);
            }
            ctx.request.result = await validation.validateAsync(sourceData, opts);
        }
        catch (error) {
            if (error instanceof joi.ValidationError) {
                return await reportCustomError(error);
            }
            throw error;
        }
        return await next();
    };
};
const getDataSource = (ctx, source) => {
    switch (source) {
        case 'body':
            return ctx.request?.body ?? {};
        case 'cookies':
            return parseCookie(ctx.headers?.cookie ?? '');
        case 'params':
            return ctx.params ?? {};
        case 'query':
            return ctx.request?.query ?? {};
        case 'state':
            return ctx?.state;
    }
};
const parseCookie = (str) => str
    .split(';')
    .map((v) => v.split('='))
    .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
}, {});
const reportCustomError = async (error) => {
    throw new UnprocessableEntity(ErrorCode.INVALID_INPUT, ErrorDescription.INVALID_INPUT, error.details).withRootError(error);
};
//# sourceMappingURL=validation.handler.js.map