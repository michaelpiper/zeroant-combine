import AdminJS, { type AdminPages, type CurrentAdmin } from 'adminjs';
import Router from 'koa';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
import { type KoaAuthOptions } from 'zeroant-common/constants';
export default class AdminEntry extends RegistryRouteEntryFactory {
    router: Router;
    name: string;
    dynamicRoute: boolean;
    protected admin: AdminJS;
    private readonly serverAdapter;
    pages: AdminPages;
    buildRoutes(): void;
    get auth(): KoaAuthOptions;
    beforeStart(): void;
    authenticate: (email: string, password: string) => Promise<CurrentAdmin | null>;
    onStart(): void;
}
