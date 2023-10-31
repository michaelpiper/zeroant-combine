import { AddonPlugin } from 'zeroant-factory/addon.plugin'
import { Redis } from 'ioredis'
import { RedisConfig } from '../config/redis.config.js'
import { type JsonValue } from '@prisma/client/runtime/library.js'
import { type ZeroantContext } from 'zeroant-factory/zeroant.context'
import { type ConfigFactory } from 'zeroant-factory/config.factory'

export class RedisPlugin extends AddonPlugin {
  private readonly _redis
  private readonly _config
  constructor(context: ZeroantContext<ConfigFactory>) {
    super(context)
    this._config = context.config.addons.get(RedisConfig)
    this._redis = new Redis(this._config.options)
  }

  async initialize(): Promise<void> {
    if (this._redis != null && this._redis !== undefined && ['connect', 'ready'].includes(this._redis.status)) {
      console.info(new Date(), '[Redis]: Already Started')
      return
    }
    this.debug('info', 'Enabled')
    await this._redis
      .info()
      .then(() => {
        this.debug('info', this._redis.status)
      })
      .catch((e) => {
        this.debug('error', e)
      })
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

  async set(key: string, value: JsonValue, ttl?: number | string): Promise<boolean> {
    if (ttl === undefined) {
      return await this._redis.set(key, JSON.stringify(value)).then((value) => {
        if (value === 'OK') {
          return true
        }
        return false
      })
    }
    return await this._redis.set(key, JSON.stringify(value), 'EX', ttl).then((value) => {
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
    return new Redis(this.options)
  }

  get instance() {
    return this._redis
  }

  get options() {
    return this._config.options
  }
}
