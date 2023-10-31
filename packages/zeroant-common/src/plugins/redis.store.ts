import Redis, { type Cluster, type ClusterNode, type ClusterOptions, type RedisOptions } from 'ioredis'

import type { Cache, Store, Config } from 'cache-manager'

export type RedisCache = Cache<RedisStore>

export interface RedisStore extends Store {
  readonly isCacheable: (value: unknown) => boolean
  get client(): Redis.Redis | Cluster
}

// eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
const getVal = (value: unknown) => JSON.stringify(value) || '"undefined"'

export class NoCacheableError extends Error {
  name = 'NoCacheableError'
  constructor(public message: string) {
    super(message)
  }
}

export const avoidNoCacheable = async <T>(p: Promise<T>) => {
  try {
    return await p
  } catch (e) {
    if (!(e instanceof NoCacheableError)) throw e
  }
}
function builder(
  redisCache: Redis.Redis | Cluster,
  reset: () => Promise<void>,
  keys: (pattern: string) => Promise<string[]>,
  options?: Config
) {
  const isCacheable = options?.isCacheable != null ? options.isCacheable : (value: unknown) => value !== undefined && value !== null

  return {
    async get<T>(key: string) {
      const val = await redisCache.get(key)
      if (val === undefined || val === null) return undefined
      else return JSON.parse(val) as T
    },
    async set<T>(key: string, value: T, ttl?: number) {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!isCacheable(value as never)) {
        throw new NoCacheableError(`"${value as string}" is not a cacheable value`)
      }
      const t = ttl === undefined ? options?.ttl : ttl
      if (t !== undefined && t !== 0) {
        await redisCache.set(key, getVal(value), 'PX', t)
      } else await redisCache.set(key, getVal(value))
    },
    async mset(args, ttl) {
      const t = ttl === undefined ? options?.ttl : ttl
      if (t !== undefined && t !== 0) {
        const multi = redisCache.multi()
        for (const [key, value] of args) {
          if (!isCacheable(value as never)) {
            // eslint-disable-next-line @typescript-eslint/no-throw-literal
            throw new NoCacheableError(`"${getVal(value)}" is not a cacheable value`)
          }
          multi.set(key, getVal(value), 'PX', t)
        }
        await multi.exec()
      } else {
        await redisCache.mset(
          args.flatMap(([key, value]) => {
            if (!isCacheable(value as never)) {
              throw new Error(`"${getVal(value)}" is not a cacheable value`)
            }
            return [key, getVal(value)] as [string, string]
          })
        )
      }
    },
    mget: async (...args) =>
      await redisCache.mget(args).then((x) => x.map((x) => (x === null || x === undefined ? undefined : (JSON.parse(x) as unknown)))),
    async mdel(...args: string[]) {
      await redisCache.del(args)
    },
    async del(key: string) {
      await redisCache.del(key)
    },
    ttl: async (key) => await redisCache.pttl(key),
    keys: async (pattern = '*') => await keys(pattern),
    reset,
    isCacheable,
    get client() {
      return redisCache
    }
  } satisfies RedisStore
}

export interface RedisClusterConfig {
  nodes: ClusterNode[]
  options?: ClusterOptions
}

export async function redisStore(
  options?: (RedisOptions | { clusterConfig: RedisClusterConfig } | { redis: Redis.Redis | Cluster }) & Config
) {
  options ||= {} as any
  const redisCache =
    'redis' in options!
      ? options.redis
      : 'clusterConfig' in options!
      ? new Redis.Cluster(options.clusterConfig.nodes, options.clusterConfig.options)
      : new Redis.Redis(options!)

  return redisInsStore(redisCache, options)
}

export function redisInsStore(redisCache: Redis.Redis | Cluster, options?: Config) {
  const reset = async () => {
    await redisCache.flushdb()
  }
  const keys = async (pattern: string) => await redisCache.keys(pattern)

  return builder(redisCache, reset, keys, options)
}
