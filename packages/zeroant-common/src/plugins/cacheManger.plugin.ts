import { RedisConfig } from '../config/redis.config.js'
import { AddonPlugin } from 'zeroant-factory/addon.plugin'
import cacheManager, { type MemoryCache, type MultiCache, type Milliseconds, type Cache, type Store } from 'cache-manager'
import { TtlUtils } from 'zeroant-util/ttl.util'
import { BadRequest } from 'zeroant-response/clientErrors/badRequest.clientError'
import { ErrorCode, ErrorDescription } from '../constants.js'
import { redisStore } from './redis.store.js'
import { RedisPlugin } from './redis.plugin.js'
export type StrategySource<T = never> = () => T | Promise<T>
export class CacheError extends BadRequest {
  constructor(message: string) {
    super(ErrorCode.CACHE_EXCEPTION, ErrorDescription.CACHE_EXCEPTION, message)
  }
}
export class CacheData<T> {
  static defaultTtl = 1000
  constructor(
    public data: T,
    public createdAt: Milliseconds
  ) {}

  static createTimestamp(): Milliseconds {
    return new Date().getTime()
  }

  expired(ttl: Milliseconds) {
    if (typeof this.createdAt !== 'number') {
      return true
    }
    return new Date().getTime() > this.createdAt + (ttl ?? 0)
  }
}
export abstract class CacheStrategy<T = never> {
  protected key: string
  source: StrategySource<T>
  protected ttl: Milliseconds = 10000
  async interceptor(manager: CacheManagerPlugin): Promise<T> {
    throw new Error('Must implement interceptor')
  }

  async exec(manager: CacheManagerPlugin): Promise<T> {
    if (this.ttl > manager.maxTtl) {
      throw new CacheError(
        `Ttl is grater than expected of max ${manager.maxTtl}ms found ${this.ttl}ms which is (${this.ttl - manager.maxTtl}ms) more`
      )
    }
    return await this.interceptor(manager)
  }

  setSource(source: StrategySource<T>) {
    this.source = source
    return this
  }

  setTtl(ttl: Milliseconds) {
    this.ttl = ttl
    return this
  }

  setKey(key: string) {
    this.key = key
    return this
  }
}
export class AsyncOrCacheStrategy<T> extends CacheStrategy<T | null> {
  async interceptor(manager: CacheManagerPlugin) {
    try {
      const data = await this.source()
      await manager.set(this.key, data, this.ttl)
      return data as T
    } catch (_) {}
    if (await manager.has(this.key)) {
      return (await manager.get(this.key, this.ttl)) as T
    }
    return null
  }
}
export class CacheOrAsyncStrategy<T> extends CacheStrategy<T> {
  async interceptor(manager: CacheManagerPlugin) {
    const cached = await manager.find(this.key)
    if (manager._has(cached) && manager._expired(cached, this.ttl)) {
      await manager.del(this.key)
    } else {
      if (manager._has(cached)) {
        return cached?.data as T
      }
    }
    const data = await this.source()
    await manager.set(this.key, data, this.ttl)
    return data as T
  }
}

export class JustCacheStrategy<T> extends CacheStrategy<T | null> {
  async interceptor(manager: CacheManagerPlugin) {
    const cached = await manager.find(this.key)
    if (manager._has(cached) && manager._expired(cached, this.ttl)) {
      await manager.del(this.key)
    } else {
      if (manager._has(cached)) {
        return cached?.data
      }
    }
    return null
  }
}

export class JustAsyncStrategy<T> extends CacheStrategy<T | null> {
  async interceptor(manager: CacheManagerPlugin) {
    try {
      const data = await this.source()
      await manager.set(this.key, data, this.ttl)
      return data
    } catch (error) {
      if (error instanceof Error) {
        throw new CacheError(`Error occured while catching data: ${error.message}`)
      }
      throw new CacheError('Unknown Error occured while catching data')
    }
  }
}
export class CacheManagerPlugin extends AddonPlugin {
  redisCache: Cache<Store>
  memoryCache: MemoryCache
  multiCache: MultiCache
  maxTtl = TtlUtils.oneDay
  async initialize() {
    const config = this.context.config.addons.lazyGet(RedisConfig)
    try {
      const redis = this.context.plugin.get(RedisPlugin).instance
      this.redisCache = await cacheManager.caching(redisStore, {
        redis,
        // ttlAutopurge: true,
        ttl: this.maxTtl
      })
    } catch (error) {
      this.redisCache = await cacheManager.caching(redisStore, {
        ...config.options,
        url: config.redisUrl,
        ttl: this.maxTtl
      })
    }

    this.memoryCache = await cacheManager.caching('memory', { max: 100, ttlAutopurge: true, ttl: this.maxTtl })
    this.multiCache = cacheManager.multiCaching([this.memoryCache, this.redisCache])
  }

  async find(key: string) {
    const jsonString: string | undefined = await this.multiCache.get(key)
    if (jsonString === null || jsonString === undefined) {
      return null
    }
    const json = JSON.parse(jsonString)
    const data = new CacheData(json.data, json.createdAt)
    return data
  }

  async expired(key: string, ttl: Milliseconds): Promise<boolean> {
    const data = await this.find(key)
    return this._expired(data, ttl)
  }

  _expired(data: CacheData<any> | null, ttl: Milliseconds): boolean {
    console.log('_expired data', data?.createdAt, data?.expired(ttl))
    if (data === null || data.expired(ttl)) {
      return true
    }
    return false
  }

  async get(key: string, ttl: Milliseconds) {
    const data = await this.find(key)
    if (data === null || data.expired(ttl)) {
      if (data?.expired(ttl) === true) {
        await this.del(key)
      }
      return null
    }
    return data.data
  }

  async set(key: string, value: any, ttl?: Milliseconds): Promise<void> {
    const expiry = CacheData.createTimestamp()
    const jsonString = JSON.stringify(new CacheData(value, expiry))
    await this.multiCache
      .set(key, jsonString, ttl === 0 || (typeof ttl === 'number' && ttl > this.maxTtl) ? this.maxTtl : ttl)
      .catch((e) => {
        this.debug('error', 'multiCache.set', e)
      })
  }

  async has(key: string) {
    const jsonString = await this.multiCache.get(key)
    return this._has(jsonString)
  }

  _has(jsonString: any): boolean {
    if (jsonString === null || jsonString === undefined) {
      return false
    }
    return true
  }

  async del(key: string) {
    await this.multiCache.del(key)
  }

  async withStrategy<T = never>(strategy: CacheStrategy<T>) {
    return await strategy.exec(this)
  }
}
