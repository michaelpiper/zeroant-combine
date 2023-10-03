import Router from 'koa-router';
import errorHandler from 'zeroant-response/error.handler';
import responseHandler from 'zeroant-response/response.handler';
export class ChildRouter extends Router {
    constructor(config) {
        super(config);
        this.use(errorHandler());
        this.use(responseHandler());
    }
}
//# sourceMappingURL=child.route.js.map