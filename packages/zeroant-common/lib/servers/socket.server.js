import { SocketEvent, WebSocketCloseCode } from 'zeroant-constant/socket.enum';
import { ServerFactory } from 'zeroant-factory/server.factory';
import { RedisPlugin } from '../plugins/redis.plugin.js';
import { WebSocketServer } from 'ws';
import * as uuid from 'uuid';
import { PubSocketConfig } from '../config/pubSocket.config.js';
import { PubSocketPayload, SubSocketPayload } from '../dto/socket.payload.js';
import { ZeroantEvent } from '../constants.js';
export class SocketServer extends ServerFactory {
    _io;
    _redis;
    constructor(context) {
        super(context);
        this._redis = context.getPlugin(RedisPlugin).instance;
    }
    get enabled() {
        return this.context.config.enableSocket;
    }
    initialize() {
        if (!this.enabled) {
            return;
        }
        this.debug('info', 'Enabled');
    }
    onStart() {
        if (!this.enabled) {
            return;
        }
        const serverInstance = this.context.server;
        this._io = new WebSocketServer({
            server: serverInstance
        });
        this.listen();
    }
    subscribe(payload, identifier = 'sub') {
        const service = {
            send: () => {
                if (payload.sub !== null && payload.topic !== null) {
                    this.to(payload.sub, identifier).send(payload.topic, payload.payload);
                }
                else if (payload.topic !== null) {
                    for (const client of this._io.clients.values()) {
                        if (client.topics.includes(payload.topic) || client.topics.includes('*')) {
                            client.sendPayload({ topic: payload.topic, payload: payload.payload });
                        }
                    }
                }
            },
            subscribe: () => {
                if (!(payload.sub !== null && payload.topic !== null)) {
                    return;
                }
                for (const client of this._io.clients.values()) {
                    if (client[identifier] !== payload.sub) {
                        continue;
                    }
                    if (client.topics.includes(payload.topic)) {
                        client.sendResPayload(payload.topic, 0, {
                            message: `Already subscribed to topic ${payload.topic} `
                        });
                    }
                    else {
                        client.topics.push(payload.topic);
                        client.sendResPayload(payload.topic, 0, {
                            message: `Subscribed to topic ${payload.topic} `
                        });
                    }
                }
            },
            unsubscribe: () => {
                if (!(payload.sub !== null && payload.topic !== null)) {
                    return;
                }
                for (const client of this._io.clients.values()) {
                    if (client[identifier] !== payload.sub) {
                        continue;
                    }
                    if (client.topics.includes(payload.topic)) {
                        client.topics = client.topics.filter((topic) => topic !== payload.topic);
                        client.sendResPayload(payload.topic, 0, {
                            message: `Unsubscribed to topic ${payload.topic} `
                        });
                    }
                    else {
                        client.sendResPayload(payload.topic, 0, {
                            message: `Already unsubscribed to topic ${payload.topic} `
                        });
                    }
                }
            }
        };
        return service;
    }
    to(sub, identifier = 'sub') {
        const clients = [];
        if (this.enabled) {
            for (const client of this._io.clients.values()) {
                if (client[identifier] === sub) {
                    clients.push(client);
                }
            }
        }
        return {
            clients,
            send: (topic, payload) => {
                for (const client of clients) {
                    client.sendPayload({ topic, payload });
                }
            },
            close: (code, data) => {
                for (const client of clients) {
                    client.close(code, data);
                    this._io.clients.delete(client);
                }
            }
        };
    }
    decodeAuth({ authorization } = {}) {
        if (authorization === undefined || authorization === null) {
            return [];
        }
        const [type, encoded = ''] = authorization.split(' ');
        if (type !== 'Basic') {
            return [];
        }
        const [username = '', password = null] = Buffer.from(encoded, 'base64').toString('utf-8').split(':');
        if (password === null) {
            return [undefined, username];
        }
        return [username, password];
    }
    applyHelper(client) {
        client.sendPayload = (payload) => {
            const data = Buffer.from(JSON.stringify(payload));
            client.send(data);
        };
        client.sendResPayload = (topic, code, payload) => {
            client.sendPayload({
                topic: topic + '_RES',
                code,
                payload
            });
        };
        if (!Array.isArray(client.topics)) {
            client.topics = [];
        }
        if (typeof client.uuid !== 'string') {
            client.uuid = uuid.v4();
        }
    }
    listen() {
        this._io
            .on(SocketEvent.CONNECTION, (socket, message) => {
            this.applyHelper(socket);
            const url = message.url;
            const [protocol = 'sub', password] = this.decodeAuth(message.headers);
            this.debug('info', 'New Connection', message.headers, { protocol, password }, url);
            if (protocol === 'pub') {
                void this.onPub(socket, message, password).catch((e) => {
                    this.debug('error', 'ON PUB', e.message);
                });
            }
            else {
                void this.onSub(socket, message, password).catch((e) => {
                    this.debug('error', 'ON SUB', e.message);
                });
            }
        })
            .on('close', () => {
            this._close(WebSocketCloseCode.CLOSE_ABNORMAL, 'server restart');
            this.debug('info', 'Is disconnected');
        });
        this.debug('info', 'Is listening');
    }
    async onPub(socket, message, password) {
        if (password === null || password === undefined || !this.context.config.addons.get(PubSocketConfig).pubKey.includes(password)) {
            this.debug('error', this.context.config.addons.get(PubSocketConfig).pubKey.join(' '), password);
            socket.close(WebSocketCloseCode.CLOSE_NORMAL, 'Unauthorized passkey');
            return;
        }
        socket.on('ping', (data) => {
            console.log('PubSocket ping request', data);
        });
        socket.on(SocketEvent.MESSAGE, (data, isBinary) => {
            if (data instanceof Buffer) {
                const payload = PubSocketPayload.fromBuffer(data);
                this.pubEvents(socket, payload);
            }
            else {
                const payload = new PubSocketPayload('RAW', data);
                this.pubEvents(socket, payload);
            }
        });
    }
    async onSub(socket, message, password) {
        if (password !== null && password !== undefined) {
            const [realm, token] = password.split(' ', 2);
            const payload = new SubSocketPayload('CONNECTION_UPGRADE', { token, realm });
            this.subEvents(socket, payload);
        }
        socket.on('ping', (data) => {
            console.log('ClientSocket ping request from client', data);
        });
        socket.on(SocketEvent.MESSAGE, (data, isBinary) => {
            if (data instanceof Buffer) {
                const payload = SubSocketPayload.fromBuffer(data);
                this.subEvents(socket, payload);
            }
            else {
                const payload = new SubSocketPayload('RAW', data);
                this.subEvents(socket, payload);
            }
        });
    }
    subEvents(client, payload) {
        this.debug('info', 'SUB New Event', payload);
        this.context.emit(ZeroantEvent.SUB_SOCKET, client, payload);
    }
    pubEvents(client, payload) {
        this.debug('info', 'PUB New Event', payload);
        this.context.emit(ZeroantEvent.PUB_SOCKET, client, payload);
    }
    close() {
        if (!this.enabled) {
            return;
        }
        this._close();
        this._io?.close();
        this.debug('info', 'Stopped');
    }
    _close(code = WebSocketCloseCode.SERVICE_RESTART, message = 'Server Restarting') {
        if (!this._io) {
            return;
        }
        for (const client of this._io.clients.values()) {
            client.close(code, message);
        }
    }
    get instance() {
        return this._io;
    }
}
//# sourceMappingURL=socket.server.js.map