import { AddonConfig } from 'zeroant-factory/addon.config';
export class PubSocketConfig extends AddonConfig {
    get pubUrl() {
        try {
            return this.config.get('PUB_SOCKET_URL').split(',');
        }
        catch (error) {
            if (!this.usePub) {
                return [];
            }
            throw error;
        }
    }
    get pubKey() {
        try {
            return this.config.get('PUB_SOCKET_KEY').split(',');
        }
        catch (error) {
            if (!this.usePub) {
                return [];
            }
            throw error;
        }
    }
    get usePub() {
        return this.config.get('USE_PUB_SOCKET', 'true').toLowerCase() === 'true';
    }
    get options() {
        return this._options();
    }
    _options() {
        return {
            url: this.pubUrl,
            key: this.pubKey,
            usePub: this.usePub
        };
    }
}
//# sourceMappingURL=pubSocket.config.js.map