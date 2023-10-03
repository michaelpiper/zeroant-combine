import dotenv from 'dotenv'
import { join, resolve } from 'path'
// import { type AddonConfigConstructor, type AddonConfig } from 'zeroant-factory/addon.config.js'
import { ABS_PATH, ConfigFactory } from 'zeroant-factory/config.factory'
const ENV_FILE_PATH = resolve(join(ABS_PATH, '.env'))
const isEnvFound = dotenv.config({ path: ENV_FILE_PATH })
if (isEnvFound.error != null) {
  console.log(join(ABS_PATH, '.env'))
  throw new Error('Cannot find .env file.')
}

export class Config extends ConfigFactory {
  samplePlatformAudience: string | null
  samplePlatformPublicKey: string
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
    this.samplePlatformAudience = this.get('SAMPLE_PLATFORM_AUDIENCE', null)
    this.samplePlatformPublicKey = this.get('SAMPLE_PLATFORM_PUBLIC_KEY', '123123')
  }
}
