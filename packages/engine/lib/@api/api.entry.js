import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import responseHandler from 'zeroant-response/response.handler';
import errorHandler from 'zeroant-response/error.handler';
import Router from 'koa-router';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
export default class ApiRouteEntry extends RegistryRouteEntryFactory {
    router = new Router({
        prefix: '/api'
    });
    name = 'api';
    buildRoutes() {
        this.router.use(bodyParser({ jsonLimit: '1mb' }));
        this.router.use(cors());
        this.router.use(errorHandler());
        this.router.use(responseHandler());
    }
}
//# sourceMappingURL=api.entry.js.map