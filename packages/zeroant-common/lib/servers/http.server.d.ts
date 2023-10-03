/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import Koa from 'koa';
import { type Server } from 'http';
import type RegistryFactory from 'zeroant-factory/registry.factory';
import { type RegistryRouteEntryFactory, type RegistryRouteEntryConstructor } from 'zeroant-factory/registry.factory';
import { ServerFactory } from 'zeroant-factory/server.factory';
import { type ConfigFactory } from 'zeroant-factory/config.factory';
import { type ZeroantContext } from 'zeroant-factory/zeroant.context';
export declare class HttpServer extends ServerFactory {
    _app: Koa;
    protected _server: Server;
    protected _port: number;
    constructor(context: ZeroantContext<ConfigFactory>);
    get enabled(): boolean;
    initialize(registry: RegistryFactory): void;
    initRoutes(routes: Array<RegistryRouteEntryConstructor<RegistryRouteEntryFactory>>): void;
    isStandAlone(appName: string, _apps?: string[]): boolean;
    protected _initRoute(route: RegistryRouteEntryFactory): Koa<Koa.DefaultState, Koa.DefaultContext> | Koa<any, Koa.DefaultContext & import("koa-router").IRouterParamContext<any, {}>>;
    initMiddleware(middlewareList: Koa.Middleware[]): void;
    callback(): (req: import("http").IncomingMessage | import("http2").Http2ServerRequest, res: import("http2").Http2ServerResponse | import("http").ServerResponse<import("http").IncomingMessage>) => Promise<void>;
    onStart(): void;
    close(): void;
    get config(): ConfigFactory;
    get instance(): Koa;
}
