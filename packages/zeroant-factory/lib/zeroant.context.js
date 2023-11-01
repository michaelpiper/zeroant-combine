import { createServer } from 'http';
import { InternalServerError } from 'zeroant-response/serverErrors/internalServerError.serverError';
import { ErrorCode, ErrorDescription } from 'zeroant-constant/response.enum';
import { ZeroantEvent } from 'zeroant-constant';
import { EventEmitter } from 'events';
export class ZeroantContext {
    Config;
    static PORT = 8080;
    static HOSTNAME = '127.0.0.1';
    _server;
    _port;
    _hostname;
    #store = new Map();
    #workers = new Map();
    #event = new EventEmitter();
    #registry;
    _servers = [];
    constructor(Config) {
        this.Config = Config;
    }
    initWorkers(workers) {
        for (const Worker of workers) {
            const worker = new Worker(this);
            this.#workers.set(worker.name, worker);
        }
    }
    getWorkerByName(workerName) {
        return this.#workers.get(workerName) ?? null;
    }
    getWorkerNames() {
        return this.#workers.keys();
    }
    get workers() {
        return {
            get: (Worker) => this.getWorker(Worker)
        };
    }
    getWorkers() {
        const workers = [];
        for (const worker of this.#workers.values()) {
            workers.push(worker);
        }
        return workers;
    }
    getWorker(Worker) {
        for (const worker of this.#workers.values()) {
            if (worker instanceof Worker) {
                return worker;
            }
        }
        throw new InternalServerError(ErrorCode.UNIMPLEMENTED_EXCEPTION, ErrorDescription.UNIMPLEMENTED_EXCEPTION, `Worker ${Worker.name} not registered check common/registry.ts for more information`);
    }
    listen(callback) {
        this.beforeStart();
        const config = this.getConfig();
        this._port = config.serverPort ?? ZeroantContext.PORT;
        this._hostname = config.serverHostname ?? ZeroantContext.HOSTNAME;
        const callbacks = this._servers.map((server) => server.callback());
        this._server = createServer((req, res) => {
            void (async (req, res) => {
                for (const callback of callbacks) {
                    await callback(req, res);
                }
            })(req, res);
        });
        this._server.listen(this._port, this._hostname, () => {
            this.onStart();
            if (typeof callback === 'function') {
                callback();
            }
        });
    }
    onStart() {
        this.#event.emit(ZeroantEvent.START);
        for (const plugin of this.plugin.values()) {
            plugin.onStart();
        }
        for (const server of this._servers) {
            server.onStart();
        }
        ;
        this.config.logging('info', () => {
            console.info(new Date(), '[ZeroantContext]: Running On Port', this._port);
        });
    }
    beforeStart() {
        this.#event.emit(ZeroantEvent.BEFORE_START);
        for (const plugin of this.plugin.values()) {
            plugin.beforeStart();
        }
        for (const server of this._servers) {
            server.beforeStart();
        }
    }
    has(key) {
        return this.#store.has(key);
    }
    async safeExit(code, signal) {
        if (signal !== undefined)
            console.info(new Date(), '[ZeroantContext]:', `Received ${signal}.`);
        await this.close();
        process.exit(code);
    }
    async close() {
        this.#event.emit(ZeroantEvent.CLOSE);
        const wait = [];
        for (const plugin of this.plugin.values()) {
            wait.push(Promise.resolve().then(async () => {
                await plugin.close();
            }));
        }
        for (const server of this._servers) {
            wait.push(Promise.resolve().then(async () => {
                await server.close();
            }));
        }
        if (!this._server) {
            return;
        }
        wait.push(new Promise((resolve) => {
            if (!this._server) {
                resolve();
                return;
            }
            this._server.close((err) => {
                if (err != null) {
                    console.trace(err);
                }
                resolve();
            });
        }));
        await Promise.all(wait);
        this.config.logging('info', () => {
            console.info(new Date(), '[ZeroantContext]: Stopped');
        });
    }
    bootstrap(registry) {
        if (this.hasRegistry) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `${new Date().toISOString()} Registry already bootstrap for zeroant and it can't be overridden`);
        }
        this.#registry = registry;
        registry.bootstrap(this);
        this.#event.emit(ZeroantEvent.BOOTSTRAP, this);
    }
    get hasRegistry() {
        return ![null, undefined].includes(this.#registry);
    }
    get registry() {
        if (!this.hasRegistry) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `${new Date().toISOString()} Registry not register for zeroant yet, please bootstrap before using registry`);
        }
        return this.#registry;
    }
    ready() {
        this.#event.emit(ZeroantEvent.READY, this);
        this.#registry.ready(this);
    }
    initServer(Server, registry) {
        const server = new Server(this);
        server.initialize(registry);
        this._servers.push(server);
        this.#store.set(`server:${Server.name}`, server);
    }
    getServer(Server) {
        const server = this.#store.get(`server:${Server.name}`);
        if (server === null || server === undefined) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `${Server.name} Server Not Init`);
        }
        return server;
    }
    async initPlugin(plugin) {
        this.#store.set('plugin', plugin);
        await plugin.initialize();
    }
    getPlugins() {
        const plugin = this.#store.get('plugin');
        if (plugin === null || plugin === undefined) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Plugin Not Init');
        }
        return plugin;
    }
    async initConfig(config) {
        this.#store.set('config', config);
    }
    async initLogger(logger) {
        this.#store.set('logger', logger);
    }
    get(name) {
        const inst = this.#store.get(name);
        if (inst === null || inst === undefined) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `Resources ${name} Not found`);
        }
        return inst;
    }
    set(name, value) {
        if (this.has(name)) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, `Can't Override Resources ${name}`);
        }
        this.#store.set(name, value);
        return this;
    }
    getLogger() {
        const logger = this.#store.get('logger');
        if (logger === null || logger === undefined) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Logger Not Init');
        }
        return logger;
    }
    getConfig() {
        const config = this.#store.get('config');
        if (config === null || config === undefined) {
            throw new InternalServerError(ErrorCode.SERVER_EXCEPTION, ErrorDescription.SERVER_EXCEPTION, 'Config Not Init');
        }
        return config;
    }
    getPlugin(addon) {
        return this.plugin.get(addon);
    }
    get log() {
        return this.getLogger();
    }
    get server() {
        return this._server;
    }
    get plugin() {
        return this.getPlugins();
    }
    get config() {
        return this.getConfig();
    }
    on(eventName, listener) {
        this.#event.on(eventName, listener);
        return this;
    }
    once(eventName, listener) {
        this.#event.once(eventName, listener);
        return this;
    }
    off(eventName, listener) {
        this.#event.off(eventName, listener);
        return this;
    }
    removeListener(eventName, listener) {
        this.#event.removeListener(eventName, listener);
        return this;
    }
    removeAllListeners(eventName) {
        this.#event.removeAllListeners(eventName);
        return this;
    }
    rawListeners(eventName) {
        this.#event.rawListeners(eventName);
        return this;
    }
    emit(eventName, ...args) {
        return this.#event.emit(eventName, ...args);
    }
}
//# sourceMappingURL=zeroant.context.js.map