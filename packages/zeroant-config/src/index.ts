import dotenv from 'dotenv'
import { join, resolve } from 'path'
import { ABS_PATH, ConfigFactory } from 'zeroant-factory/config.factory'
export { ABS_PATH, ConfigFactory } from 'zeroant-factory/config.factory'
export { AddonConfig, type AddonConfigConstructor, type AddonConfigFactory } from 'zeroant-factory/addon.config'
const ENV_FILE_PATH = resolve(join(ABS_PATH, '.env'))
const isEnvFound = dotenv.config({ path: ENV_FILE_PATH })
if (isEnvFound.error != null) {
  console.log(join(ABS_PATH, '.env'))
  throw new Error('Cannot find .env file.')
}

export class Config extends ConfigFactory {
  baseUrl: string | null
  apiBaseUrl: string | null
  static #instance = new Config(process.env)
  static get instance(): Config {
    return this.#instance
  }

  constructor(protected readonly _config: Record<string, string | undefined>) {
    super(_config)
    this.baseUrl = this.get('BASE_URL', null)
    this.apiBaseUrl = this.get('API_BASE_URL', null)
  }
}
