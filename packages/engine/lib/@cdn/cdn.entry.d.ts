import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
import Server from 'koa';
export default class CDNRouteEntry extends RegistryRouteEntryFactory {
    router: Server<Server.DefaultState, Server.DefaultContext>;
    name: string;
    buildRoutes(): void;
}
