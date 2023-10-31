import { RedisConfig } from '../config/redis.config.js';
import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import cacheManager from 'cache-manager';
import { TtlUtils } from 'zeroant-util/ttl.util';
import { BadRequest } from 'zeroant-response/clientErrors/badRequest.clientError';
import { ErrorCode, ErrorDescription } from '../constants.js';
import { redisStore } from './redis.store.js';
import { RedisPlugin } from './redis.plugin.js';
export class CacheError extends BadRequest {
    constructor(message) {
        super(ErrorCode.CACHE_EXCEPTION, ErrorDescription.CACHE_EXCEPTION, message);
    }
}
export class CacheData {
    data;
    createdAt;
    static defaultTtl = 1000;
    constructor(data, createdAt) {
        this.data = data;
        this.createdAt = createdAt;
    }
    static createTimestamp() {
        return new Date().getTime();
    }
    expired(ttl) {
        if (typeof this.createdAt !== 'number') {
            return true;
        }
        return new Date().getTime() > this.createdAt + (ttl ?? 0);
    }
}
export class CacheStrategy {
    key;
    source;
    ttl = 10000;
    async interceptor(manager) {
        throw new Error('Must implement interceptor');
    }
    async exec(manager) {
        if (this.ttl > manager.maxTtl) {
            throw new CacheError(`Ttl is grater than expected of max ${manager.maxTtl}ms found ${this.ttl}ms which is (${this.ttl - manager.maxTtl}ms) more`);
        }
        return await this.interceptor(manager);
    }
    setSource(source) {
        this.source = source;
        return this;
    }
    setTtl(ttl) {
        this.ttl = ttl;
        return this;
    }
    setKey(key) {
        this.key = key;
        return this;
    }
}
export class AsyncOrCacheStrategy extends CacheStrategy {
    async interceptor(manager) {
        try {
            const data = await this.source();
            await manager.set(this.key, data, this.ttl);
            return data;
        }
        catch (_) { }
        if (await manager.has(this.key)) {
            return (await manager.get(this.key, this.ttl));
        }
        return null;
    }
}
export class CacheOrAsyncStrategy extends CacheStrategy {
    async interceptor(manager) {
        const cached = await manager.find(this.key);
        if (manager._has(cached) && manager._expired(cached, this.ttl)) {
            await manager.del(this.key);
        }
        else {
            if (manager._has(cached)) {
                return cached?.data;
            }
        }
        const data = await this.source();
        await manager.set(this.key, data, this.ttl);
        return data;
    }
}
export class JustCacheStrategy extends CacheStrategy {
    async interceptor(manager) {
        const cached = await manager.find(this.key);
        if (manager._has(cached) && manager._expired(cached, this.ttl)) {
            await manager.del(this.key);
        }
        else {
            if (manager._has(cached)) {
                return cached?.data;
            }
        }
        return null;
    }
}
export class JustAsyncStrategy extends CacheStrategy {
    async interceptor(manager) {
        try {
            const data = await this.source();
            await manager.set(this.key, data, this.ttl);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new CacheError(`Error occured while catching data: ${error.message}`);
            }
            throw new CacheError('Unknown Error occured while catching data');
        }
    }
}
export class CacheManagerPlugin extends AddonPlugin {
    redisCache;
    memoryCache;
    multiCache;
    maxTtl = TtlUtils.oneDay;
    async initialize() {
        const config = this.context.config.addons.lazyGet(RedisConfig);
        try {
            const redis = this.context.plugin.get(RedisPlugin).instance;
            this.redisCache = await cacheManager.caching(redisStore, {
                redis,
                ttl: this.maxTtl
            });
        }
        catch (error) {
            this.redisCache = await cacheManager.caching(redisStore, {
                ...config.options,
                ttl: this.maxTtl
            });
        }
        this.memoryCache = await cacheManager.caching('memory', { max: 100, ttlAutopurge: true, ttl: this.maxTtl });
        this.multiCache = cacheManager.multiCaching([this.memoryCache, this.redisCache]);
    }
    async find(key) {
        const jsonString = await this.multiCache.get(key);
        if (jsonString === null || jsonString === undefined) {
            return null;
        }
        const json = JSON.parse(jsonString);
        const data = new CacheData(json.data, json.createdAt);
        return data;
    }
    async expired(key, ttl) {
        const data = await this.find(key);
        return this._expired(data, ttl);
    }
    _expired(data, ttl) {
        console.log('_expired data', data?.createdAt, data?.expired(ttl));
        if (data === null || data.expired(ttl)) {
            return true;
        }
        return false;
    }
    async get(key, ttl) {
        const data = await this.find(key);
        if (data === null || data.expired(ttl)) {
            if (data?.expired(ttl) === true) {
                await this.del(key);
            }
            return null;
        }
        return data.data;
    }
    async set(key, value, ttl) {
        const expiry = CacheData.createTimestamp();
        const jsonString = JSON.stringify(new CacheData(value, expiry));
        await this.multiCache
            .set(key, jsonString, ttl === 0 || (typeof ttl === 'number' && ttl > this.maxTtl) ? this.maxTtl : ttl)
            .catch((e) => {
            this.debug('error', 'multiCache.set', e);
        });
    }
    async has(key) {
        const jsonString = await this.multiCache.get(key);
        return this._has(jsonString);
    }
    _has(jsonString) {
        if (jsonString === null || jsonString === undefined) {
            return false;
        }
        return true;
    }
    async del(key) {
        await this.multiCache.del(key);
    }
    async withStrategy(strategy) {
        return await strategy.exec(this);
    }
}
//# sourceMappingURL=cacheManger.plugin.js.map