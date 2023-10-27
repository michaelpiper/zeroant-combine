import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { Redis } from 'ioredis';
import { RedisConfig } from '../config/redis.config.js';
export class RedisPlugin extends AddonPlugin {
    _redis;
    _config;
    constructor(context) {
        super(context);
        this._config = context.config.addons.getOrSet(RedisConfig);
        this._redis = new Redis(this._config.redisUrl, this._config.ioOptions);
    }
    async initialize() {
        if (this._redis != null || this._redis !== undefined) {
            console.info(new Date(), '[Redis]: Already Started');
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
        if (ttl == null && ttl !== undefined) {
            return await this._redis.set(key, JSON.stringify(value)).then((value) => {
                if (value === 'OK') {
                    return true;
                }
                return false;
            });
        }
        return await this._redis.set(key, JSON.stringify(value), 'PX', ttl).then((value) => {
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
        return new Redis(this._config.redisUrl, this.options);
    }
    get instance() {
        return this._redis;
    }
    get options() {
        return this._config.ioOptions;
    }
}
//# sourceMappingURL=redis.plugin.js.map