import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { v4 } from 'uuid';
import { WebSocket } from 'ws';
import { ErrorCode, ErrorDescription, WebSocketCloseCode } from '../constants.js';
import { PubSocketConfig } from '../config/pubSocket.config.js';
import { TtlUtils } from 'zeroant-util/ttl.util';
import { BadRequest } from 'zeroant-response/clientErrors/badRequest.clientError';
import { PubSocketPayload } from '../dto/socket.payload.js';
export class PubSocket extends AddonPlugin {
    connections = {};
    pingInterval = TtlUtils.oneMinute;
    retryInterval = TtlUtils.oneSecond * 3;
    indefiniteRetryInterval = TtlUtils.oneMinute * 3;
    maxRetry = 5;
    reconnectTimer = {};
    pingingTimer = {};
    shutingDown = false;
    _options;
    get enabled() {
        return this.context.config.addons.get(PubSocketConfig).usePub;
    }
    async initialize() {
        if (!this.enabled) {
            return;
        }
        this.debug('info', 'Enabled');
        const options = this.context.config.addons.get(PubSocketConfig).options;
        this._options = options;
        const uuid = v4();
        for (const url of this._options.url) {
            this.createSub(uuid, url, this._options.key[0]);
        }
    }
    to(sub) {
        const service = {
            send: (topic, data) => {
                if (sub === null || sub === undefined) {
                    throw new BadRequest(ErrorCode.INVALID_PAYLOAD, ErrorDescription.INVALID_PAYLOAD, 'Invalid payload for pub socket send event please provide a valid subscriber');
                }
                const payload = new PubSocketPayload(topic, data, sub);
                for (const socket of Object.values(this.connections)) {
                    this.debug('debug', 'socket sending message', socket.uuid, socket.readyState);
                    if (socket.readyState === socket.OPEN) {
                        socket.send(payload.toBuffer());
                    }
                }
            },
            broadcast: (topic, data) => {
                if (topic === null || topic === undefined) {
                    throw new BadRequest(ErrorCode.INVALID_PAYLOAD, ErrorDescription.INVALID_PAYLOAD, 'Invalid payload for pub socket broadcast event please provide a valid topic');
                }
                const payload = new PubSocketPayload(topic, data);
                for (const socket of Object.values(this.connections)) {
                    if (socket.readyState === socket.OPEN) {
                        socket.send(payload.toBuffer());
                    }
                }
            }
        };
        return service;
    }
    createSub(uuid, url, key, retries = 0) {
        const websocket = new WebSocket(url, {
            auth: `pub:${key}`
        });
        websocket.uuid = uuid;
        websocket.sub = key;
        websocket.retries = retries;
        websocket.onclose = (event) => {
            if (this.shutingDown) {
                return;
            }
            this.debug('info', 'Closed', event.code.toString(), event.reason);
            this.tryClearPingingInterval(uuid);
            this.tryClearReconnectInterval(uuid);
            if (event.code !== WebSocketCloseCode.SERVICE_RESTART) {
                websocket.retries += 1;
            }
            if (websocket.retries < this.maxRetry) {
                this.debug('info', 'Retrying next', websocket.retries, 'in', this.retryInterval, 'ms');
                setTimeout(() => {
                    this.createSub(uuid, url, key, websocket.retries);
                }, this.retryInterval);
            }
            else if (websocket.retries >= this.maxRetry) {
                this.debug('info', 'Retrying exhausted waiting for', this.indefiniteRetryInterval, 'ms', 'to next retries');
                setTimeout(() => {
                    this.createSub(uuid, url, key, 0);
                }, this.indefiniteRetryInterval);
            }
        };
        websocket.onerror = (event) => {
            if (this.shutingDown) {
                return;
            }
            this.debug('error', 'OnError', event.message);
        };
        websocket.onopen = (event) => {
            if (this.shutingDown) {
                this.debug('info', 'ShutingDown', 'No Action initiated');
                return;
            }
            this.tryClearReconnectInterval(uuid);
            this.pingingTimer[uuid] = setInterval(() => {
                this.debug('info', 'Pinging', `websocket client ${uuid}`);
                websocket.ping();
            }, this.pingInterval);
        };
        this.connections[uuid] = websocket;
    }
    tryClearReconnectInterval(uuid) {
        if (this.reconnectTimer[uuid] !== undefined) {
            clearTimeout(this.reconnectTimer[uuid]);
        }
    }
    tryClearPingingInterval(uuid) {
        if (this.pingingTimer[uuid] !== undefined) {
            clearInterval(this.pingingTimer[uuid]);
        }
    }
    close() {
        this.shutingDown = true;
        for (const [uuid, socket] of Object.entries(this.connections)) {
            this.tryClearPingingInterval(uuid);
            this.tryClearReconnectInterval(uuid);
            if (socket.readyState === socket.OPEN || socket.readyState === socket.CONNECTING) {
                socket.close();
            }
        }
        this.debug('info', 'Stopped');
    }
}
//# sourceMappingURL=pubSocket.plugin.js.map