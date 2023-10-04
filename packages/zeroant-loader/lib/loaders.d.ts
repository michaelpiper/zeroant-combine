import { Config } from 'zeroant-config/index';
import { type CustomConfig } from 'zeroant-factory/config.factory';
import type RegistryFactory from 'zeroant-factory/registry.factory';
export declare const loaders: (customConfig?: CustomConfig & {
    registry?: RegistryFactory;
}) => Promise<import("zeroant-factory/zeroant.context").ZeroantContext<Config>>;
