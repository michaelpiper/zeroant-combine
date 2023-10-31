import { Config, AddonConfig, type ConfigFactory } from 'zeroant-config'
import winston from 'winston'
import type * as Transport from 'winston-transport'
class LoggerConfig extends AddonConfig<ConfigFactory> {
  get transports() {
    const transports: Transport[] = []
    if (this.config.get('LOG_TO_CONSOLE', 'true') === 'true') {
      transports.push(new winston.transports.Console({ format: winston.format.prettyPrint() }))
    }
    return transports
  }
}
const config = Config.instance.addons.lazyGet<LoggerConfig>(LoggerConfig)
export const logger = winston.createLogger({
  level: '',
  format: winston.format.json(),
  get defaultMeta() {
    return {
      get environment() {
        return Config.instance.environment
      }
    }
  },
  transports: config.transports
})
