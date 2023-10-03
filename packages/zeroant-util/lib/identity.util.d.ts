/// <reference types="node" resolution-mode="require"/>
export declare class IdentityUtil {
    static generateUUID(): string;
    static uuidTransformer: {
        to: (uuid: string | undefined) => Buffer | undefined;
        from: (bin: Buffer) => string;
    };
    static generateID(): string;
    static tinyID(): string;
    static challenge(): {
        codeChallenge: string;
        codeVerifier: string;
    };
    static generateToken(): string;
}
