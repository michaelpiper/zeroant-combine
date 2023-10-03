import { AddonConfig } from 'zeroant-factory/addon.config';
import { type AdminJSOptions } from 'adminjs';
export declare class AdminConfig extends AddonConfig {
    get cdnBaseUrl(): string;
    get watchAdmin(): boolean;
    get userName(): string;
    get userAvatarUrl(): string | null;
    get userTitle(): string;
    get userRole(): string;
    get userId(): string;
    get theme(): string;
    get userEmail(): string;
    get password(): string;
    get secureSession(): boolean;
    get sessionKeys(): string[];
    get auth(): {
        user: string;
        pass: string;
    };
    get options(): AdminJSOptions;
    get aws(): {
        region: string;
        credentials: {
            accessKeyId: string;
            secretAccessKey: string;
        };
        expires: number;
        bucket: string;
    };
    _options(): AdminJSOptions;
}
