import Redis from 'ioredis';
const getVal = (value) => JSON.stringify(value) || '"undefined"';
export class NoCacheableError extends Error {
    message;
    name = 'NoCacheableError';
    constructor(message) {
        super(message);
        this.message = message;
    }
}
export const avoidNoCacheable = async (p) => {
    try {
        return await p;
    }
    catch (e) {
        if (!(e instanceof NoCacheableError))
            throw e;
    }
};
function builder(redisCache, reset, keys, options) {
    const isCacheable = options?.isCacheable != null ? options.isCacheable : (value) => value !== undefined && value !== null;
    return {
        async get(key) {
            const val = await redisCache.get(key);
            if (val === undefined || val === null)
                return undefined;
            else
                return JSON.parse(val);
        },
        async set(key, value, ttl) {
            if (!isCacheable(value)) {
                throw new NoCacheableError(`"${value}" is not a cacheable value`);
            }
            const t = ttl === undefined ? options?.ttl : ttl;
            if (t !== undefined && t !== 0) {
                await redisCache.set(key, getVal(value), 'PX', t);
            }
            else
                await redisCache.set(key, getVal(value));
        },
        async mset(args, ttl) {
            const t = ttl === undefined ? options?.ttl : ttl;
            if (t !== undefined && t !== 0) {
                const multi = redisCache.multi();
                for (const [key, value] of args) {
                    if (!isCacheable(value)) {
                        throw new NoCacheableError(`"${getVal(value)}" is not a cacheable value`);
                    }
                    multi.set(key, getVal(value), 'PX', t);
                }
                await multi.exec();
            }
            else {
                await redisCache.mset(args.flatMap(([key, value]) => {
                    if (!isCacheable(value)) {
                        throw new Error(`"${getVal(value)}" is not a cacheable value`);
                    }
                    return [key, getVal(value)];
                }));
            }
        },
        mget: async (...args) => await redisCache.mget(args).then((x) => x.map((x) => (x === null || x === undefined ? undefined : JSON.parse(x)))),
        async mdel(...args) {
            await redisCache.del(args);
        },
        async del(key) {
            await redisCache.del(key);
        },
        ttl: async (key) => await redisCache.pttl(key),
        keys: async (pattern = '*') => await keys(pattern),
        reset,
        isCacheable,
        get client() {
            return redisCache;
        }
    };
}
export async function redisStore(options) {
    options ||= {};
    const redisCache = 'redis' in options
        ? options.redis
        : 'clusterConfig' in options
            ? new Redis.Cluster(options.clusterConfig.nodes, options.clusterConfig.options)
            : options.url != null
                ? new Redis.Redis(options.url, options)
                : new Redis.Redis(options);
    return redisInsStore(redisCache, options);
}
export function redisInsStore(redisCache, options) {
    const reset = async () => {
        await redisCache.flushdb();
    };
    const keys = async (pattern) => await redisCache.keys(pattern);
    return builder(redisCache, reset, keys, options);
}
//# sourceMappingURL=redis.store.js.map