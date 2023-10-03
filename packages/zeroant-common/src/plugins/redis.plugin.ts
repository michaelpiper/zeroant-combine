import redis from 'redis'
import { AddonPlugin } from 'zeroant-factory/addon.plugin'
import { Redis, type RedisOptions } from 'ioredis'
import { RedisConfig } from '../config/redis.config.js'
import { type JsonValue } from 'zeroant-constant/json.type'
import { type ZeroantContext } from 'zeroant-factory/zeroant.context'
import { type ConfigFactory } from 'zeroant-factory/config.factory'

export class RedisPlugin extends AddonPlugin {
  private readonly _redis
  private readonly _config
  constructor(context: ZeroantContext<ConfigFactory>) {
    super(context)
    this._config = context.config.addons.get(RedisConfig)
    this._redis = redis.createClient({ url: this._config.redisUrl, ...this._config.options })
  }

  async initialize(): Promise<void> {
    if (this._redis != null || this._redis !== undefined) {
      console.info(new Date(), '[Redis]: Already Started')
    }
    if (!this._redis.isOpen) {
      this._redis
        .connect()
        .then(() => {
          this.debug('info', 'Connected')
        })
        .catch((e) => {
          this.debug('error', e)
        })
      this.debug('info', 'Enabled')
    }
  }

  async get<T = JsonValue>(key: string): Promise<T> {
    return await this._redis.get(key).then((value) => {
      if (typeof value === 'string') {
        try {
          return JSON.parse(value)
        } catch (_) {}
      }
      return null
    })
  }

  async has(key: string): Promise<boolean> {
    return await this._redis.exists(key).then((value) => {
      if (value > 0) {
        return true
      }
      return false
    })
  }

  async set(key: string, value: JsonValue, ttl?: number): Promise<boolean> {
    return await this._redis.set(key, JSON.stringify(value), { EX: ttl }).then((value) => {
      if (value === 'OK') {
        return true
      }
      return false
    })
  }

  async del(key: string): Promise<boolean> {
    return await this._redis.del(key).then((value) => {
      if (value > 0) {
        return true
      }
      return false
    })
  }

  close() {
    this._redis.quit().catch((e) => {
      this.debug('error', e)
    })
    console.info(new Date(), '[RedisPlugin]: Stopped')
  }

  clone() {
    return redis.createClient(this.options)
  }

  ioClone(): Redis {
    return new Redis(this._config.ioRedisUrl, this.ioOptions)
  }

  get instance() {
    return this._redis
  }

  get options() {
    return this._config.options
  }

  get ioOptions(): RedisOptions {
    return this._config.ioOptions
  }
}
