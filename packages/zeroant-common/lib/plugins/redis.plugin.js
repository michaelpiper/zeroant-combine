import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { Redis } from 'ioredis';
import { RedisConfig } from '../config/redis.config.js';
export class RedisPlugin extends AddonPlugin {
    _redis;
    _config;
    constructor(context) {
        super(context);
        this._config = context.config.addons.get(RedisConfig);
        this._redis = new Redis(this._config.redisUrl, this._config.options);
    }
    async initialize() {
        if (this._redis != null && this._redis !== undefined && ['connect', 'ready'].includes(this._redis.status)) {
            console.info(new Date(), '[Redis]: Already Started');
            return;
        }
        this.debug('info', 'Enabled');
        await this._redis
            .info()
            .then(() => {
            this.debug('info', this._redis.status);
        })
            .catch((e) => {
            this.debug('error', e);
        });
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
        if (ttl === undefined) {
            return await this._redis.set(key, JSON.stringify(value)).then((value) => {
                if (value === 'OK') {
                    return true;
                }
                return false;
            });
        }
        return await this._redis.set(key, JSON.stringify(value), 'EX', ttl).then((value) => {
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
    async close() {
        if (!['end'].includes(this._redis.status)) {
            await this._redis.quit().catch((e) => {
                this.debug('error', e.message);
            });
        }
        console.info(new Date(), '[RedisPlugin]: Stopped');
    }
    clone() {
        return new Redis(this._config.redisUrl, this.options);
    }
    get instance() {
        return this._redis;
    }
    get options() {
        return this._config.options;
    }
}
//# sourceMappingURL=redis.plugin.js.map