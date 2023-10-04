import AdminJS from 'adminjs';
import Router from 'koa';
import AdminJSKoa from '@adminjs/koa';
import * as AdminJSPrisma from '@adminjs/prisma';
import { InternalServerError } from 'zeroant-response/serverErrors/internalServerError.serverError';
import { ErrorCode, ErrorDescription, ZeroantEvent } from 'zeroant-common/constants';
import { AdminConfig } from 'zeroant-common/config/admin.config';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
import { KoaAdapter } from '@bull-board/koa';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter.js';
import { componentLoader } from './resources/component-loader.js';
import { Components } from './resources/components.js';
import { createResources } from './resources/index.js';
import { DBPlugin } from 'zeroant-common/plugins/db.plugin';
import { HttpServer } from 'zeroant-common/servers/http.server';
import session from 'koa-session';
export default class AdminEntry extends RegistryRouteEntryFactory {
    router = new Router({});
    name = 'admin';
    dynamicRoute = true;
    admin;
    serverAdapter = new KoaAdapter();
    pages = {};
    buildRoutes() {
        AdminJS.registerAdapter({
            Resource: AdminJSPrisma.Resource,
            Database: AdminJSPrisma.Database
        });
        this.serverAdapter.setBasePath('/admin/queue');
        this.context.on(ZeroantEvent.START, () => {
            this.onStart();
        });
        this.context.on(ZeroantEvent.BEFORE_START, () => {
            this.beforeStart();
        });
        const config = this.context.config.addons.get(AdminConfig);
        const options = config.options;
        const mountPoint = '/admin';
        const db = this.context.getPlugin(DBPlugin);
        options.dashboard = {
            component: Components.Dashboard
        };
        const admin = new AdminJS({
            ...options,
            pages: this.pages,
            resources: createResources(config, db),
            rootPath: mountPoint,
            componentLoader
        });
        this.admin = admin;
        createBullBoard({
            queues: this.context.getWorkers().map((worker) => new BullAdapter(worker.getQueue())),
            serverAdapter: this.serverAdapter
        });
    }
    get auth() {
        const config = this.context.config.addons.get(AdminConfig);
        return {
            sessionOptions: {
                secure: config.secureSession,
                key: config.sessionKeys.at(0)
            },
            authenticate: this.authenticate
        };
    }
    beforeStart() {
        const auth = this.auth;
        const app = this.context.getServer(HttpServer).instance;
        this.router.use(auth.sessionOptions != null ? session(auth.sessionOptions, app) : session(app));
        this.router.use(async (ctx, next) => {
            console.log('check /admin/queue session', ctx.request.url.startsWith('/admin/queue'), ['', null, undefined].includes(ctx.session?.adminUser));
            if (ctx.request.url.startsWith('/admin/queue') && ['', null, undefined].includes(ctx.session?.adminUser)) {
                ctx.redirect('/admin/login');
                return;
            }
            return await next();
        });
        this.router.use(this.serverAdapter.registerPlugin());
        const route = AdminJSKoa.buildAuthenticatedRouter(this.admin, app, this.auth);
        this.router.use(route.routes()).use(route.allowedMethods());
    }
    authenticate = async (email, password) => {
        const config = this.context.config.addons.get(AdminConfig);
        if (email === config.userName && password === config.password) {
            return {
                email: config.userEmail,
                username: config.userName,
                title: config.userTitle,
                role: config.userRole,
                avatarUrl: config.userAvatarUrl ?? undefined,
                id: config.userId,
                theme: config.theme
            };
        }
        return null;
    };
    onStart() {
        const admin = this.admin;
        const watchAdmin = this.context.config.addons.get(AdminConfig).watchAdmin;
        if (watchAdmin) {
            admin.watch().catch((rootError) => {
                const error = new InternalServerError(ErrorCode.IMPLEMENTATION_EXCEPTION, ErrorDescription.IMPLEMENTATION_EXCEPTION, 'Admin watch has implementation error').withRootError(rootError);
                throw error;
            });
        }
        this.debug('info', `AdminJS started on port: ${this.context.config.serverPort} path: ${admin.options.rootPath}`);
    }
}
//# sourceMappingURL=admin.entry.js.map