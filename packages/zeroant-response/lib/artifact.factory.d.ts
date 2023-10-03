import { type ISuccessResponse } from 'zeroant-constant/response.interface';
import { type SuccessData } from 'zeroant-constant/response.type';
export declare abstract class ArtifactFactory<T = SuccessData> {
    #private;
    protected readonly _data: T | null;
    protected readonly _statusCode: number;
    protected readonly _message: string;
    constructor(_data?: T | null, overrideMessage?: string);
    set(key: 'message' | 'content-type', value: string): this;
    get status(): number;
    get contentType(): string;
    get data(): ISuccessResponse;
}
