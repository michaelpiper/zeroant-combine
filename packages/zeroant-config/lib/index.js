import dotenv from 'dotenv';
import { join, resolve } from 'path';
import { APP_PATH, ConfigFactory } from 'zeroant-factory/config.factory';
const ENV_FILE_PATH = resolve(join(APP_PATH, '.env'));
const isEnvFound = dotenv.config({ path: ENV_FILE_PATH });
if (isEnvFound.error != null) {
    console.log(join(APP_PATH, '.env'));
    throw new Error('Cannot find .env file.');
}
export class Config extends ConfigFactory {
    _config;
    samplePlatformAudience;
    samplePlatformPublicKey;
    baseUrl;
    apiBaseUrl;
    static #instance = new Config(process.env);
    static get instance() {
        return this.#instance;
    }
    constructor(_config) {
        super(_config);
        this._config = _config;
        this.baseUrl = this.get('BASE_URL', null);
        this.apiBaseUrl = this.get('API_BASE_URL', null);
        this.samplePlatformAudience = this.get('SAMPLE_PLATFORM_AUDIENCE', null);
        this.samplePlatformPublicKey = this.get('SAMPLE_PLATFORM_PUBLIC_KEY', '123123');
    }
}
//# sourceMappingURL=index.js.map