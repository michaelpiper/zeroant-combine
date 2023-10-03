import { ErrorFactory } from '../error.factory.js';
export declare class Conflict extends ErrorFactory {
    readonly statusCode: number;
}
