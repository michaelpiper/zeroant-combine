import redis from 'redis';
import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { Redis } from 'ioredis';
import { RedisConfig } from '../config/redis.config.js';
export class RedisPlugin extends AddonPlugin {
    _redis;
    _config;
    constructor(context) {
        super(context);
        this._config = context.config.addons.get(RedisConfig);
        this._redis = redis.createClient({ url: this._config.redisUrl, ...this._config.options });
    }
    async initialize() {
        if (this._redis != null || this._redis !== undefined) {
            console.info(new Date(), '[Redis]: Already Started');
        }
        if (!this._redis.isOpen) {
            this._redis
                .connect()
                .then(() => {
                this.debug('info', 'Connected');
            })
                .catch((e) => {
                this.debug('error', e);
            });
            this.debug('info', 'Enabled');
        }
    }
    async get(key) {
        return await this._redis.get(key).then((value) => {
            if (typeof value === 'string') {
                try {
                    return JSON.parse(value);
                }
                catch (_) { }
            }
            return null;
        });
    }
    async has(key) {
        return await this._redis.exists(key).then((value) => {
            if (value > 0) {
                return true;
            }
            return false;
        });
    }
    async set(key, value, ttl) {
        return await this._redis.set(key, JSON.stringify(value), { EX: ttl }).then((value) => {
            if (value === 'OK') {
                return true;
            }
            return false;
        });
    }
    async del(key) {
        return await this._redis.del(key).then((value) => {
            if (value > 0) {
                return true;
            }
            return false;
        });
    }
    close() {
        this._redis.quit().catch((e) => {
            this.debug('error', e);
        });
        console.info(new Date(), '[RedisPlugin]: Stopped');
    }
    clone() {
        return redis.createClient(this.options);
    }
    ioClone() {
        return new Redis(this._config.ioRedisUrl, this.ioOptions);
    }
    get instance() {
        return this._redis;
    }
    get options() {
        return this._config.options;
    }
    get ioOptions() {
        return this._config.ioOptions;
    }
}
//# sourceMappingURL=redis.plugin.js.map