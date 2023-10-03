export class ErrorFactory extends Error {
    errorCode;
    errorDescription;
    errorMessage;
    statusCode;
    #contentType = 'application/json';
    #cause;
    constructor(errorCode, errorDescription, errorMessage) {
        super();
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.errorDescription = errorDescription;
        this.errorMessage = errorMessage;
    }
    get message() {
        return this.errorMessage;
    }
    get contentType() {
        return this.#contentType;
    }
    set(key, value) {
        if (key === 'content-type') {
            this.#contentType = value;
        }
        if (key === 'message') {
            this.errorMessage = value;
        }
        if (key === 'description') {
            this.errorDescription = value;
        }
        if (key === 'code') {
            this.errorCode = value;
        }
        return this;
    }
    withRootError(cause) {
        this.#cause = cause;
        return this;
    }
    get _cause() {
        return this.#cause;
    }
}
//# sourceMappingURL=error.factory.js.map