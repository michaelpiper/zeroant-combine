import Redis, { type Cluster, type ClusterNode, type ClusterOptions, type RedisOptions } from 'ioredis';
import type { Cache, Store, Config } from 'cache-manager';
export type RedisCache = Cache<RedisStore>;
export interface RedisStore extends Store {
    readonly isCacheable: (value: unknown) => boolean;
    get client(): Redis.Redis | Cluster;
}
export declare class NoCacheableError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
export declare const avoidNoCacheable: <T>(p: Promise<T>) => Promise<T | undefined>;
export interface RedisClusterConfig {
    nodes: ClusterNode[];
    options?: ClusterOptions;
}
export declare function redisStore(options?: ((RedisOptions & {
    url?: string;
}) | {
    clusterConfig: RedisClusterConfig;
} | {
    redis: Redis.Redis | Cluster;
}) & Config): Promise<{
    get<T>(key: string): Promise<T | undefined>;
    set<T_1>(key: string, value: T_1, ttl?: number | undefined): Promise<void>;
    mset(args: [string, unknown][], ttl: number | undefined): Promise<void>;
    mget: (...args: string[]) => Promise<unknown[]>;
    mdel(...args: string[]): Promise<void>;
    del(key: string): Promise<void>;
    ttl: (key: string) => Promise<number>;
    keys: (pattern?: string | undefined) => Promise<string[]>;
    reset: () => Promise<void>;
    isCacheable: (val: unknown) => boolean;
    readonly client: Redis.Redis | Redis.Cluster;
}>;
export declare function redisInsStore(redisCache: Redis.Redis | Cluster, options?: Config): {
    get<T>(key: string): Promise<T | undefined>;
    set<T_1>(key: string, value: T_1, ttl?: number | undefined): Promise<void>;
    mset(args: [string, unknown][], ttl: number | undefined): Promise<void>;
    mget: (...args: string[]) => Promise<unknown[]>;
    mdel(...args: string[]): Promise<void>;
    del(key: string): Promise<void>;
    ttl: (key: string) => Promise<number>;
    keys: (pattern?: string | undefined) => Promise<string[]>;
    reset: () => Promise<void>;
    isCacheable: (val: unknown) => boolean;
    readonly client: Redis.Redis | Redis.Cluster;
};
