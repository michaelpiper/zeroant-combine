import Router from 'koa-router';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
export default class ApiRouteEntry extends RegistryRouteEntryFactory {
    router: Router;
    name: string;
    buildRoutes(): void;
}
