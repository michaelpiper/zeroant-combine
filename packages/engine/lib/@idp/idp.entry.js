import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from 'koa-router';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
export default class IdpRouteEntry extends RegistryRouteEntryFactory {
    router = new Router({
        prefix: '/idp'
    });
    name = 'idp';
    options = {
        body: {
            jsonLimit: '1mb'
        }
    };
    buildRoutes() {
        this.router.use(bodyParser(this.options.body));
        this.router.use(cors(this.options.cors));
    }
}
//# sourceMappingURL=idp.entry.js.map