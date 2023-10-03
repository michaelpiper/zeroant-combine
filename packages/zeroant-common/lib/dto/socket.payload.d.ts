/// <reference types="node" resolution-mode="require"/>
export declare class PubSocketPayload<SocketTopic extends string, T extends Record<string, any>> {
    topic: SocketTopic;
    payload: T;
    sub: string | null;
    constructor(topic: SocketTopic, payload: T, sub?: string | null);
    static fromBuffer(data: Buffer): PubSocketPayload<any, any>;
    toBuffer(): Buffer;
}
export declare class SubSocketPayload<SocketTopic extends string, T extends Record<string, any>> {
    topic: SocketTopic;
    payload: T;
    constructor(topic: SocketTopic, payload: T);
    static fromBuffer(data: Buffer): PubSocketPayload<any, any>;
    toBuffer(): Buffer;
}
