import { AddonConfig } from 'zeroant-factory/addon.config'
import { type RedisOptions as IORedisOptions } from 'ioredis'

export class RedisConfig extends AddonConfig {
  get redisUrl() {
    return this.config.get<string>('REDIS_URI')
  }

  get options(): IORedisOptions {
    return {}
  }
}
