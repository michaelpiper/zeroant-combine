import type Router from 'koa-router';
import type Koa from 'koa';
import { type ZeroantContext } from './zeroant.context.js';
import { type AddonConfigFactory } from './addon.config.js';
import { type AddonPluginFactory } from './addon.plugin.js';
import { type ServerFactory, type ServerFactoryConstructor } from './server.factory.js';
import { type WorkerFactory, type WorkerFactoryConstructor } from './worker.factory.js';
import { type IDebugger, type ConfigFactory } from './config.factory.js';
export declare abstract class InternalBootstrap {
    #private;
    $internalLifecycle(context: ZeroantContext<ConfigFactory>): void;
    get debug(): IDebugger;
}
export type RegistryRouteEntryConstructor<T extends RegistryRouteEntryFactory> = new (context: ZeroantContext<ConfigFactory>) => T;
export declare abstract class RegistryRouteEntryFactory extends InternalBootstrap {
    protected readonly context: ZeroantContext<ConfigFactory>;
    constructor(context: ZeroantContext<ConfigFactory>);
    name: string;
    abstract router: Router | Koa;
    buildRoutes(): void;
}
export default abstract class RegistryFactory {
    bootstrap(context: ZeroantContext<ConfigFactory>): void;
    ready(context: ZeroantContext<ConfigFactory>): void;
    abstract readonly configs: AddonConfigFactory[];
    abstract readonly plugins: AddonPluginFactory[];
    abstract readonly servers: Array<ServerFactoryConstructor<ServerFactory>>;
    abstract readonly middlewares: Koa.Middleware[];
    abstract readonly routes: Array<RegistryRouteEntryConstructor<RegistryRouteEntryFactory>>;
    abstract readonly workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>;
}
