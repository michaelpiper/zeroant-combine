import { ErrorFactory } from '../error.factory.js';
export declare class Forbidden extends ErrorFactory {
    readonly statusCode: number;
}
