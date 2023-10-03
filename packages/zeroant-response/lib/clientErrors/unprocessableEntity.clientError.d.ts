import { ErrorFactory } from '../error.factory.js';
export declare class UnprocessableEntity extends ErrorFactory {
    readonly statusCode: number;
}
