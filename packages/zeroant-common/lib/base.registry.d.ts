import { type Middleware, type DefaultState, type DefaultContext } from 'koa';
import { type AddonConfigFactory } from 'zeroant-factory/addon.config';
import { type AddonPluginFactory } from 'zeroant-factory/addon.plugin';
import RegistryFactory, { type RegistryRouteEntryConstructor, type RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
import { type ServerFactoryConstructor, type ServerFactory } from 'zeroant-factory/server.factory';
import { type WorkerFactoryConstructor, type WorkerFactory } from 'zeroant-factory/worker.factory';
declare class Manager<T> {
    store: T[];
    constructor(store: T[]);
    add: (classType: T) => this;
}
export declare class BaseRegistry extends RegistryFactory {
    configs: AddonConfigFactory[];
    plugins: AddonPluginFactory[];
    servers: Array<ServerFactoryConstructor<ServerFactory>>;
    middlewares: Array<Middleware<DefaultState, DefaultContext, any>>;
    routes: Array<RegistryRouteEntryConstructor<RegistryRouteEntryFactory>>;
    workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>;
    get worker(): Manager<WorkerFactoryConstructor<WorkerFactory<any, any>>>;
    get config(): Manager<AddonConfigFactory>;
    get middleware(): Manager<Middleware<DefaultState, DefaultContext, any>>;
    get plugin(): Manager<AddonPluginFactory>;
    get route(): Manager<RegistryRouteEntryConstructor<RegistryRouteEntryFactory>>;
    get server(): Manager<ServerFactoryConstructor<ServerFactory>>;
}
export {};
