import { AddonConfig } from 'zeroant-factory/addon.config';
export class CDNConfig extends AddonConfig {
    get url() {
        return this.config.get('CDN_BASE_URL');
    }
}
//# sourceMappingURL=cdn.config.js.map