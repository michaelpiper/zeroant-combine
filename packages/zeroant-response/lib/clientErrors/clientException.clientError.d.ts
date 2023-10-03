import { ErrorFactory } from '../error.factory.js';
export declare class ClientException extends ErrorFactory {
    readonly statusCode: number;
    constructor(message: string);
}
