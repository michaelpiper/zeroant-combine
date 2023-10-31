import { AddonConfig } from 'zeroant-factory/addon.config';
import { type RedisOptions as IORedisOptions } from 'ioredis';
export declare class RedisConfig extends AddonConfig {
    get redisUrl(): string;
    get options(): IORedisOptions;
}
