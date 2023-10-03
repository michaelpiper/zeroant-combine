import { AddonPlugin } from 'zeroant-factory/addon.plugin';
import { PrismaClient } from '@prisma/client';
export declare class DBPlugin extends AddonPlugin {
    protected _dataSource: PrismaClient;
    initialize(): Promise<void>;
    get repositories(): PrismaClient;
    repository<T extends keyof PrismaClient>(repository: T): PrismaClient[T];
    call<T extends keyof PrismaClient>(repository: T): PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library.js").DefaultArgs>[T];
    clone(): PrismaClient<{
        datasources?: import("zeroant-constant/db.interface").Datasources | undefined;
        datasourceUrl?: string | undefined;
        errorFormat?: import("zeroant-constant/db.interface").ErrorFormat | undefined;
        log?: (import("zeroant-constant/db.interface").LogLevel | import("zeroant-constant/db.interface").LogDefinition)[] | undefined;
    }, never, import("@prisma/client/runtime/library.js").DefaultArgs>;
    destroy(): void;
    close(): void;
}
