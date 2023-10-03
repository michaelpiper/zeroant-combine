import { ErrorFactory } from '../error.factory.js';
export declare class Unauthorized extends ErrorFactory {
    readonly statusCode: number;
}
