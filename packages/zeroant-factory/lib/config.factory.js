import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum';
import { InternalServerError } from 'zeroant-response/serverErrors/internalServerError.serverError';
import { resolve } from 'path';
export const ABS_PATH = resolve('.');
export const APP_PATH = new URL('../../../', import.meta.url).pathname.replace(/\/$/, '');
export class ConfigFactory {
    _config;
    serverPort;
    serverHostname;
    environment;
    appName;
    isProd;
    productionEnvironments = ['prod', 'production'];
    addons = new ConfigAddons(this);
    absPath = ABS_PATH;
    serverMode = 'combine';
    serverApp;
    serverMountAsRoot;
    appKeys = [];
    LOG_LEVEL = '*';
    enableHTTP = true;
    enableSocket = false;
    appPath = APP_PATH;
    constructor(_config) {
        this._config = _config;
        this._init();
    }
    _init() {
        this.environment = this.get('NODE_ENV', 'development');
        this.isProd = this.productionEnvironments.includes(this.environment);
        this.serverPort = parseInt(this.get('PORT', '8080'), 10);
        this.serverHostname = this.get('HOSTNAME', '127.0.0.1');
        this.appName = this.get('APP_NAME', 'ZeroAnt');
        this.appKeys = this.get('APP_KEYS', 'shouldbereplace').split(',');
        this.serverMode = this.get('SERVER_MODE', 'combine');
        this.serverApp = this.get('SERVER_APP', '*');
        this.LOG_LEVEL = this.get('LOG_LEVEL', '*');
        this.enableHTTP = this.get('ENABLE_HTTP', 'true').toLowerCase() === 'true';
        this.enableSocket = this.get('ENABLE_SOCKET', 'false').toLowerCase() === 'true';
        this.serverMountAsRoot = this.get('SERVER_MOUNT_AS_ROOT', 'on') === 'on';
    }
    logging(level, callback) {
        if (this.LOG_LEVEL === '*' || this.LOG_LEVEL.split(',').includes(level)) {
            if (callback !== undefined) {
                callback();
            }
            return true;
        }
        return false;
    }
    createDebugger(name) {
        return (level = 'info', message, ...args) => {
            this.logging(level, () => {
                const logger = console[level] ?? console.log;
                logger(new Date(), `[${name}]:`, message, ...args);
            });
        };
    }
    get(key, defaultValue) {
        const value = this._config[key];
        if (value === null || value === undefined) {
            if (defaultValue === undefined) {
                throw new InternalServerError(ErrorCode.CONFIG_EXCEPTION, ErrorDescription.CONFIG_EXCEPTION, `Please provide a value for ${key} or a default fallback value in your config source`);
            }
            return defaultValue;
        }
        return value;
    }
    append(config) {
        Object.assign(this._config, config);
        this._init();
        return this;
    }
    getAddon(Type) {
        return this.addons.get(Type);
    }
    setAddon(Addon) {
        this.addons.set(Addon);
        return this;
    }
}
class ConfigAddons {
    config;
    _addons = new Set();
    constructor(config) {
        this.config = config;
    }
    get(Type) {
        for (const addon of this._addons.values()) {
            if (addon instanceof Type) {
                return addon;
            }
        }
        throw new InternalServerError(ErrorCode.UNIMPLEMENTED_EXCEPTION, ErrorDescription.UNIMPLEMENTED_EXCEPTION, `${Type.name} you trying to get is not implemented`);
    }
    lazyGet(Type) {
        try {
            return this.get(Type);
        }
        catch (error) {
            return this.set(Type).get(Type);
        }
    }
    set(Addon) {
        this._addons.add(new Addon(this.config));
        return this;
    }
}
//# sourceMappingURL=config.factory.js.map