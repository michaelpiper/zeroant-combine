import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { Redis } from 'ioredis';
import { type JsonValue } from '@prisma/client/runtime/library.js';
import { type ZeroantContext } from 'zeroant-factory/zeroant.context';
import { type ConfigFactory } from 'zeroant-factory/config.factory';
export declare class RedisPlugin extends AddonPlugin {
    private readonly _redis;
    private readonly _config;
    constructor(context: ZeroantContext<ConfigFactory>);
    initialize(): Promise<void>;
    get<T = JsonValue>(key: string): Promise<T>;
    has(key: string): Promise<boolean>;
    set(key: string, value: JsonValue, ttl?: number | string): Promise<boolean>;
    del(key: string): Promise<boolean>;
    close(): void;
    clone(): Redis;
    get instance(): Redis;
    get options(): import("ioredis").RedisOptions;
}
