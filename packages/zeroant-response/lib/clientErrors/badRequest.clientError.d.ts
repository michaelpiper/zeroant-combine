import { ErrorFactory } from '../error.factory.js';
export declare class BadRequest extends ErrorFactory {
    readonly statusCode: number;
}
