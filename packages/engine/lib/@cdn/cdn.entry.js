import path from 'path';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
import serve from 'koa-static';
import mount from 'koa-mount';
import Server from 'koa';
export default class CDNRouteEntry extends RegistryRouteEntryFactory {
    router = new Server({});
    name = 'cdn';
    buildRoutes() {
        this.router.use(mount('/cdn', serve(path.join(this.context.config.absPath, 'public'))));
    }
}
//# sourceMappingURL=cdn.entry.js.map