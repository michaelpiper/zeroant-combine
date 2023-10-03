import AdminJS from 'adminjs';
import Router from 'koa';
import { type ZeroantContext } from 'zeroant-factory/zeroant.context';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
import { type KoaAuthOptions } from 'zeroant-common/constants';
import { type CurrentAdmin } from 'adminjs';
import { type ConfigFactory } from 'zeroant-factory/config.factory';
export default class AdminEntry extends RegistryRouteEntryFactory {
    router: Router;
    name: string;
    dynamicRoute: boolean;
    protected admin: AdminJS;
    private readonly serverAdapter;
    constructor(context: ZeroantContext<ConfigFactory>);
    buildRoutes(): void;
    get auth(): KoaAuthOptions;
    beforeStart(): void;
    authenticate: (email: string, password: string) => Promise<CurrentAdmin | null>;
    onStart(): void;
}
