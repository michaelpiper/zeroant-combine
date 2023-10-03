import { AddonConfig } from 'zeroant-factory/addon.config';
export declare class PubSocketConfig extends AddonConfig {
    get pubUrl(): string[];
    get pubKey(): string[];
    get usePub(): boolean;
    get options(): {
        url: string[];
        key: string[];
        usePub: boolean;
    };
    _options(): {
        url: string[];
        key: string[];
        usePub: boolean;
    };
}
