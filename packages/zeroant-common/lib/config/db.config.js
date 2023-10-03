import { AddonConfig } from 'zeroant-factory/addon.config';
export class DBConfig extends AddonConfig {
    get development() {
        return {};
    }
    get production() {
        return {};
    }
    get test() {
        return {};
    }
    get options() {
        if (this.config.isProd) {
            return this.production;
        }
        switch (this.config.environment) {
            case 'production':
                return this.production;
            case 'test':
                return this.test;
            default:
                return this.development;
        }
    }
}
//# sourceMappingURL=db.config.js.map