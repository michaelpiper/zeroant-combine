import { ErrorCode, ErrorDescription } from '../constants.js';
import { BadRequest } from 'zeroant-response/clientErrors/badRequest.clientError';
export class PubSocketPayload {
    topic;
    payload;
    sub;
    constructor(topic, payload, sub = null) {
        this.topic = topic;
        this.payload = payload;
        this.sub = sub;
    }
    static fromBuffer(data) {
        const payload = data.toString('utf8');
        try {
            const json = JSON.parse(payload);
            return new PubSocketPayload(json.topic, json.payload ?? {}, json.sub ?? null);
        }
        catch (error) {
            console.error('SocketPubPayload.fromBuffer', error?.message);
        }
        throw new BadRequest(ErrorCode.INVALID_ARGUMENT, ErrorDescription.INVALID_ARGUMENT, 'Invalid PubSocketPayload used in the argument body');
    }
    toBuffer() {
        return Buffer.from(JSON.stringify({ topic: this.topic, sub: this.sub ?? null, payload: this.payload }));
    }
}
export class SubSocketPayload {
    topic;
    payload;
    constructor(topic, payload) {
        this.topic = topic;
        this.payload = payload;
    }
    static fromBuffer(data) {
        const payload = data.toString('utf8');
        try {
            const json = JSON.parse(payload);
            return new PubSocketPayload(json.topic, json.payload ?? {});
        }
        catch (error) {
            console.error('SocketPubPayload.fromBuffer', error?.message);
        }
        throw new BadRequest(ErrorCode.INVALID_ARGUMENT, ErrorDescription.INVALID_ARGUMENT, 'Invalid SubSocketPayload used in the argument body');
    }
    toBuffer() {
        return Buffer.from(JSON.stringify({ topic: this.topic, payload: this.payload }));
    }
}
//# sourceMappingURL=socket.payload.js.map