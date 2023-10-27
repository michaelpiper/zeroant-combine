import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { PrismaClient } from '@prisma/client';
export declare class DBPlugin extends AddonPlugin {
    protected _dataSource: PrismaClient;
    initialize(): Promise<void>;
    get repositories(): PrismaClient;
    repository<T extends keyof PrismaClient>(repository: T): PrismaClient[T];
    call<T extends keyof PrismaClient>(repository: T): any;
    clone(): any;
    destroy(): void;
    close(): void;
}
