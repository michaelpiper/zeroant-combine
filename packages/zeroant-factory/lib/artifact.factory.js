export class ArtifactFactory {
    _data;
    _statusCode = 200;
    _message = 'success';
    #contentType = 'application/json';
    #overrideMessage;
    constructor(_data = null, overrideMessage) {
        this._data = _data;
        this.#overrideMessage = overrideMessage;
    }
    set(key, value) {
        if (key === 'content-type') {
            this.#contentType = value;
        }
        if (key === 'message') {
            this.#overrideMessage = value;
        }
        return this;
    }
    get status() {
        return this._statusCode;
    }
    get contentType() {
        return this.#contentType;
    }
    get data() {
        const response = {
            status: this._statusCode,
            message: this.#overrideMessage ?? this._message
        };
        if (this._data === null) {
            return response;
        }
        return {
            status: this._statusCode,
            message: this.#overrideMessage ?? this._message,
            data: this._data
        };
    }
}
//# sourceMappingURL=artifact.factory.js.map