/// <reference types="node" resolution-mode="require"/>
import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { WebSocket } from 'ws';
declare module 'ws' {
    interface WebSocket {
        retries: number;
    }
}
export declare class PubSocket<PubSocketTopic extends string> extends AddonPlugin {
    connections: Record<string, WebSocket>;
    pingInterval: number;
    retryInterval: number;
    indefiniteRetryInterval: number;
    maxRetry: number;
    reconnectTimer: Record<string, number>;
    pingingTimer: Record<string, NodeJS.Timeout>;
    shutingDown: boolean;
    _options: {
        url: string[];
        key: string[];
    };
    get enabled(): boolean;
    initialize(): Promise<void>;
    to<T extends Record<string, any>>(sub?: string): {
        send: (topic: PubSocketTopic, data: T) => void;
        broadcast: (topic: PubSocketTopic, data: T) => void;
    };
    createSub(uuid: string, url: string, key: string, retries?: number): void;
    tryClearReconnectInterval(uuid: string): void;
    tryClearPingingInterval(uuid: string): void;
    close(): void;
}
