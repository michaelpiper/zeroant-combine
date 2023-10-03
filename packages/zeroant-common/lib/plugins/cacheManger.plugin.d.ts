import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { type MemoryCache, type MultiCache, type Milliseconds, type Cache, type Store } from 'cache-manager';
import { BadRequest } from 'zeroant-response/clientErrors/badRequest.clientError';
export type StrategySource<T = never> = () => T | Promise<T>;
export declare class CacheError extends BadRequest {
    constructor(message: string);
}
export declare class CacheData<T> {
    data: T;
    createdAt: Milliseconds;
    static defaultTtl: number;
    constructor(data: T, createdAt: Milliseconds);
    static createTimestamp(): Milliseconds;
    expired(ttl: Milliseconds): boolean;
}
export declare abstract class CacheStrategy<T = never> {
    protected key: string;
    source: StrategySource<T>;
    protected ttl: Milliseconds;
    interceptor(manager: CacheManagerPlugin): Promise<T>;
    exec(manager: CacheManagerPlugin): Promise<T>;
    setSource(source: StrategySource<T>): this;
    setTtl(ttl: Milliseconds): this;
    setKey(key: string): this;
}
export declare class AsyncOrCacheStrategy<T> extends CacheStrategy<T | null> {
    interceptor(manager: CacheManagerPlugin): Promise<T | null>;
}
export declare class CacheOrAsyncStrategy<T> extends CacheStrategy<T> {
    interceptor(manager: CacheManagerPlugin): Promise<T>;
}
export declare class JustCacheStrategy<T> extends CacheStrategy<T | null> {
    interceptor(manager: CacheManagerPlugin): Promise<any>;
}
export declare class JustAsyncStrategy<T> extends CacheStrategy<T | null> {
    interceptor(manager: CacheManagerPlugin): Promise<T | null>;
}
export declare class CacheManagerPlugin extends AddonPlugin {
    redisCache: Cache<Store>;
    memoryCache: MemoryCache;
    multiCache: MultiCache;
    maxTtl: number;
    initialize(): Promise<void>;
    find(key: string): Promise<CacheData<any> | null>;
    expired(key: string, ttl: Milliseconds): Promise<boolean>;
    _expired(data: CacheData<any> | null, ttl: Milliseconds): boolean;
    get(key: string, ttl: Milliseconds): Promise<any>;
    set(key: string, value: any, ttl?: Milliseconds): Promise<void>;
    has(key: string): Promise<boolean>;
    _has(jsonString: any): boolean;
    del(key: string): Promise<void>;
    withStrategy<T = never>(strategy: CacheStrategy<T>): Promise<T>;
}
