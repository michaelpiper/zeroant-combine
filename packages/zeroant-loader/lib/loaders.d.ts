import { Config } from 'zeroant-config/index';
import { type CustomConfig } from 'zeroant-factory/config.factory';
export declare const loaders: (customConfig?: CustomConfig) => Promise<import("zeroant-factory/zeroant.context").ZeroantContext<Config>>;
