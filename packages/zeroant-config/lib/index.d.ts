import { ConfigFactory } from 'zeroant-factory/config.factory';
export declare class Config extends ConfigFactory {
    #private;
    protected readonly _config: Record<string, string | undefined>;
    samplePlatformAudience: string | null;
    samplePlatformPublicKey: string;
    baseUrl: string | null;
    apiBaseUrl: string | null;
    static get instance(): Config;
    constructor(_config: Record<string, string | undefined>);
}
