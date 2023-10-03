/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { type ZeroantContext } from './zeroant.context.js';
import { type Http2ServerRequest, type Http2ServerResponse } from 'http2';
import { type IncomingMessage, type ServerResponse } from 'http';
import { type ConfigFactory } from './config.factory.js';
import type RegistryFactory from 'registry.factory.js';
export type ServerFactoryConstructor<T extends ServerFactory> = new (context: ZeroantContext<ConfigFactory>) => T;
export declare abstract class ServerFactory {
    protected context: ZeroantContext<ConfigFactory>;
    debug: import("./config.factory.js").IDebugger;
    constructor(context: ZeroantContext<ConfigFactory>);
    onStart(): void;
    initialize(registry: RegistryFactory): void;
    beforeStart(): void;
    callback(): (req: IncomingMessage | Http2ServerRequest, res: ServerResponse | Http2ServerResponse) => Promise<any>;
    close(): void;
}
