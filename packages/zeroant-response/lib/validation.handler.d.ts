import { type Middleware } from 'koa';
import joi from 'joi';
declare module 'koa' {
    interface Request {
        result?: unknown;
    }
}
export type ValidationDataSource = 'body' | 'query' | 'cookies' | 'state' | 'params';
declare const _default: (validation: joi.Schema, options?: joi.AsyncValidationOptions & {
    sources?: ValidationDataSource[];
}) => Middleware;
export default _default;
