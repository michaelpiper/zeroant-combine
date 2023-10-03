import Koa from 'koa';
import { ServerFactory } from 'zeroant-factory/server.factory';
import mount from 'koa-mount';
import koaQs from 'koa-qs';
export class HttpServer extends ServerFactory {
    _app;
    _server;
    _port;
    constructor(context) {
        super(context);
        this._app = new Koa();
        koaQs(this._app);
    }
    get enabled() {
        return this.config.enableHTTP;
    }
    initialize(registry) {
        if (!this.enabled) {
            return;
        }
        this.initMiddleware(registry.middlewares);
        this.initRoutes(registry.routes);
        this.debug('info', 'Enabled');
    }
    initRoutes(routes) {
        const apps = this.config.serverApp.split(',');
        const mode = this.config.serverMode;
        this._app.keys = this.config.appKeys;
        this.debug('info', 'Mode', mode);
        for (const Route of routes) {
            const route = new Route(this.context);
            if (mode === 'combine') {
                this._initRoute(route);
            }
            else if (mode === 'standalone') {
                if (apps.includes(route.name)) {
                    this._initRoute(route);
                }
            }
        }
    }
    isStandAlone(appName, _apps) {
        if (this.config.serverMode !== 'standalone') {
            return false;
        }
        const apps = _apps ?? this.config.serverApp.split(',');
        return apps.includes(appName);
    }
    _initRoute(route) {
        this.debug('info', `Mounting app ${route.name}`);
        route.buildRoutes();
        if (typeof route.extends === 'function') {
            ;
            route.extends();
        }
        if (route.router instanceof Koa) {
            return this._app.use(mount(route.router));
        }
        return this._app.use(mount(route.router.routes())).use(mount(route.router.allowedMethods()));
    }
    initMiddleware(middlewareList) {
        for (const middleware of middlewareList) {
            this._app.use(middleware);
        }
    }
    callback() {
        return this._app.callback();
    }
    onStart() {
        super.onStart();
        if (!this.enabled) {
            return;
        }
        this.debug('info', 'Is listening');
    }
    close() {
        if (!this.enabled) {
            return;
        }
        this.debug('info', 'Stopped');
    }
    get config() {
        return this.context.config;
    }
    get instance() {
        return this._app;
    }
}
//# sourceMappingURL=http.server.js.map