import { AddonConfig } from 'zeroant-factory/addon.config';
export class RedisConfig extends AddonConfig {
    get redisUrl() {
        return this.config.get('REDIS_URI');
    }
    get ioRedisUrl() {
        return this.config.get('REDIS_URI');
    }
    get options() {
        return {
            url: this.redisUrl
        };
    }
    get ioOptions() {
        return {};
    }
}
//# sourceMappingURL=redis.config.js.map