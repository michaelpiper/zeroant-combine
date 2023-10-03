import { type ErrorCode, type ErrorDescription } from 'zeroant-constant/response.enum';
import { type ErrorMessage } from 'zeroant-constant/response.type';
export declare abstract class ErrorFactory extends Error {
    #private;
    errorCode: ErrorCode;
    errorDescription: ErrorDescription;
    errorMessage: ErrorMessage;
    readonly statusCode: number | undefined;
    constructor(errorCode: ErrorCode, errorDescription: ErrorDescription, errorMessage: ErrorMessage);
    get message(): string;
    get contentType(): string;
    set(key: 'message' | 'description' | 'code' | 'content-type', value: string): this;
    withRootError(cause?: Error): this;
    get _cause(): Error | undefined;
}
