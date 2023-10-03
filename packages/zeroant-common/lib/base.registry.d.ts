import { type Middleware, type DefaultState, type DefaultContext } from 'koa';
import { type AddonConfigFactory } from 'zeroant-factory/addon.config';
import { type AddonPluginFactory } from 'zeroant-factory/addon.plugin';
import RegistryFactory, { type RegistryRouteEntryConstructor, type RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
import { type ServerFactoryConstructor, type ServerFactory } from 'zeroant-factory/server.factory';
import { type WorkerFactoryConstructor, type WorkerFactory } from 'zeroant-factory/worker.factory';
export declare class BaseRegistry extends RegistryFactory {
    configs: AddonConfigFactory[];
    plugins: AddonPluginFactory[];
    servers: Array<ServerFactoryConstructor<ServerFactory>>;
    middlewares: Array<Middleware<DefaultState, DefaultContext, any>>;
    routes: Array<RegistryRouteEntryConstructor<RegistryRouteEntryFactory>>;
    workers: Array<WorkerFactoryConstructor<WorkerFactory<any, any>>>;
    get worker(): {
        add: (classType: WorkerFactoryConstructor<WorkerFactory<any, any>>) => any;
    };
    get config(): {
        add: (classType: AddonConfigFactory) => any;
    };
    get middleware(): {
        add: (classType: Middleware<DefaultState, DefaultContext, any>) => any;
    };
    get plugin(): {
        add: (classType: AddonPluginFactory) => any;
    };
    get route(): {
        add: (classType: RegistryRouteEntryConstructor<RegistryRouteEntryFactory>) => any;
    };
    get server(): {
        add: (classType: ServerFactoryConstructor<ServerFactory>) => any;
    };
}
