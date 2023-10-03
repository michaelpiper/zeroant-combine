/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { type Server } from 'http';
import { type ServerFactoryConstructor, type ServerFactory } from './server.factory.js';
import { type ConfigFactory } from './config.factory.js';
import { type Plugin } from './plugin.factory.js';
import { EventEmitter } from 'events';
import { type WorkerFactoryConstructor, type WorkerFactory } from './worker.factory.js';
import { type AddonPlugin, type AddonPluginConstructor } from './addon.plugin.js';
import { type Logger } from 'winston';
import type RegistryFactory from 'registry.factory.js';
export declare class ZeroantContext<Config extends ConfigFactory> {
    #private;
    private readonly Config;
    static PORT: number;
    static HOSTNAME: string;
    protected _server: Server;
    protected _port: number;
    protected _hostname: string;
    _servers: ServerFactory[];
    constructor(Config: new (config: any) => Config);
    initWorkers(workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>): void;
    getWorkerByName<T extends WorkerFactory<any, any>>(workerName: string): T | undefined;
    getWorkerNames(): IterableIterator<string>;
    get workers(): {
        get: <T extends WorkerFactory<any, any>>(Worker: WorkerFactoryConstructor<T>) => T;
    };
    getWorkers(): Array<WorkerFactory<any, any>>;
    getWorker<T extends WorkerFactory<any, any>>(Worker: WorkerFactoryConstructor<T>): T;
    listen(callback?: () => void): void;
    onStart(): void;
    beforeStart(): void;
    has(key: string): boolean;
    close(): void;
    bootstrap(registry: RegistryFactory): void;
    get registry(): RegistryFactory;
    ready(): void;
    initServer(Server: ServerFactoryConstructor<ServerFactory>, registry: RegistryFactory): void;
    getServer<T extends ServerFactory>(Server: ServerFactoryConstructor<T>): T;
    initPlugin(plugin: Plugin): Promise<void>;
    getPlugins(): Plugin;
    initConfig(config: Config): Promise<void>;
    initLogger(logger: Logger): Promise<void>;
    getLogger<T extends Logger>(): T;
    getConfig(): Config;
    getPlugin<T extends AddonPlugin>(addon: AddonPluginConstructor<T>): T;
    get log(): Logger;
    get server(): Server;
    get plugin(): Plugin;
    get config(): Config;
    get event(): EventEmitter;
}
