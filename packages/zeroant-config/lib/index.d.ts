import { ConfigFactory } from 'zeroant-factory/config.factory';
export { ABS_PATH, ConfigFactory } from 'zeroant-factory/config.factory';
export { AddonConfig, type AddonConfigConstructor, type AddonConfigFactory } from 'zeroant-factory/addon.config';
export declare class Config extends ConfigFactory {
    #private;
    protected readonly _config: Record<string, string | undefined>;
    baseUrl: string | null;
    apiBaseUrl: string | null;
    static get instance(): Config;
    constructor(_config: Record<string, string | undefined>);
}
