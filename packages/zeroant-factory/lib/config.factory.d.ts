import { type AddonConfig, type AddonConfigConstructor } from './addon.config.js';
export declare const ABS_PATH: string;
export declare const APP_PATH: string;
export type SERVER_MODE = 'standalone' | 'combine';
export type LOG_LEVEL = '*' | 'debug' | 'info' | 'error' | 'off';
export interface CustomConfig {
    SERVER_MODE?: SERVER_MODE;
    SERVER_APP?: string;
    LOG_LEVEL?: LOG_LEVEL;
    ENABLE_HTTP?: 'true' | 'false';
    ENABLE_SOCKET?: 'true' | 'false';
    USE_PUB_SOCKET?: 'true' | 'false';
}
export type IDebugger = (level: LOG_LEVEL | undefined, message: string, ...args: any[]) => void;
export declare abstract class ConfigFactory {
    protected readonly _config: Record<Uppercase<string>, string | undefined>;
    serverPort: number;
    serverHostname: string;
    environment: string;
    appName: string;
    isProd: boolean;
    readonly productionEnvironments: string[];
    addons: ConfigAddons<this>;
    readonly absPath: string;
    serverMode: SERVER_MODE;
    serverApp: string;
    serverMountAsRoot: boolean;
    appKeys: string[];
    LOG_LEVEL: string;
    enableHTTP: boolean;
    enableSocket: boolean;
    readonly appPath: string;
    constructor(_config: Record<Uppercase<string>, string | undefined>);
    _init(): void;
    logging(level: LOG_LEVEL, callback?: () => void): boolean;
    createDebugger(name: string): IDebugger;
    get<T = any>(key: Uppercase<string>, defaultValue?: T): T;
    append(config: Record<Uppercase<string>, string | undefined>): this;
    getAddon<T extends AddonConfig<ConfigFactory>>(Type: AddonConfigConstructor<T>): T;
    setAddon(Addon: AddonConfigConstructor<AddonConfig<ConfigFactory>>): this;
}
declare class ConfigAddons<T extends ConfigFactory> {
    protected config: T;
    _addons: Set<unknown>;
    constructor(config: T);
    get<T extends AddonConfig<ConfigFactory>>(Type: AddonConfigConstructor<T>): T;
    lazyGet<T extends AddonConfig<ConfigFactory>>(Type: AddonConfigConstructor<T>): T;
    set(Addon: AddonConfigConstructor<AddonConfig<ConfigFactory>>): this;
}
export {};
