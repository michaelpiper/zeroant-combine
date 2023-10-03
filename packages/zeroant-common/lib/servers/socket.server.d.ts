/// <reference types="node" resolution-mode="require"/>
/// <reference types="node" resolution-mode="require"/>
import { WebSocketCloseCode } from 'zeroant-constant/socket.enum';
import { ServerFactory } from 'zeroant-factory/server.factory';
import { type ZeroantContext } from 'zeroant-factory/zeroant.context';
import { WebSocketServer, type WebSocket } from 'ws';
import { type IncomingMessage } from 'http';
import { PubSocketPayload, SubSocketPayload } from '../dto/socket.payload.js';
import { type ConfigFactory } from 'zeroant-factory/config.factory';
declare module 'ws' {
    interface WebSocket {
        sub: string;
        uuid: string;
        topics: string[];
        sendPayload: (payload: Record<string, any>) => void;
        sendResPayload: (topic: string, code: number, payload: Record<string, any>) => void;
    }
}
export declare class SocketServer<PubSocketTopic extends string, SubSocketTopic extends string> extends ServerFactory {
    private _io;
    private readonly _redis;
    constructor(context: ZeroantContext<ConfigFactory>);
    get enabled(): boolean;
    initialize(): void;
    onStart(): void;
    subscribe(payload: PubSocketPayload<PubSocketTopic, any>, identifier?: 'sub' | 'uuid'): {
        send: () => void;
        subscribe: () => void;
        unsubscribe: () => void;
    };
    to(sub: string, identifier?: 'sub' | 'uuid'): {
        clients: WebSocket[];
        send: (topic: string, payload: Record<string, any>) => void;
        close: (code?: number | undefined, data?: string | Buffer | undefined) => void;
    };
    decodeAuth({ authorization }?: any): (string | undefined)[];
    applyHelper(client: WebSocket): void;
    listen(): void;
    onPub(socket: WebSocket, message: IncomingMessage, password?: string): Promise<void>;
    onSub(socket: WebSocket, message: IncomingMessage, password?: string): Promise<void>;
    subEvents(client: WebSocket, payload: SubSocketPayload<SubSocketTopic, any>): void;
    pubEvents(client: WebSocket, payload: PubSocketPayload<SubSocketTopic, any>): void;
    close(): void;
    _close(code?: WebSocketCloseCode, message?: any): void;
    get instance(): WebSocketServer;
}
