import { Config, AddonConfig } from 'zeroant-config';
import winston from 'winston';
class LoggerConfig extends AddonConfig {
    get transports() {
        const transports = [];
        if (this.config.get('LOG_TO_CONSOLE', 'true') === 'true') {
            transports.push(new winston.transports.Console({ format: winston.format.prettyPrint() }));
        }
        return transports;
    }
}
const config = Config.instance.addons.lazyGet(LoggerConfig);
export const logger = winston.createLogger({
    level: '',
    format: winston.format.json(),
    get defaultMeta() {
        return {
            get environment() {
                return Config.instance.environment;
            }
        };
    },
    transports: config.transports
});
//# sourceMappingURL=console.js.map