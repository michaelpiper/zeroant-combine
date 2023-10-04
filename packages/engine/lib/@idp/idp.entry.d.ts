/// <reference types="koa__cors" />
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import Router from 'koa-router';
import { RegistryRouteEntryFactory } from 'zeroant-factory/registry.factory';
export default class IdpRouteEntry extends RegistryRouteEntryFactory {
    router: Router;
    name: string;
    options: {
        body?: bodyParser.Options;
        cors?: cors.Options;
    };
    buildRoutes(): void;
}
