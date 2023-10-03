export default abstract class IdpAdapterFactory {
    name: string;
    constructor(name: string);
    upsert(id: string, payload: Record<string, any>, expiresIn?: number): Promise<void>;
    find(id: string): Promise<void>;
    findByUserCode(userCode: string): Promise<void>;
    findByUid(uid: string): Promise<void>;
    consume(id: string): Promise<void>;
    destroy(id: string): Promise<void>;
    revokeByGrantId(grantId: string): Promise<void>;
}
