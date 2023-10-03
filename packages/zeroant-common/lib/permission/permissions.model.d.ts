import { Permission } from './permission.model.js';
import { type PermissionEntity } from './permission.entity.js';
import { type IPermissionScope } from './permission.enum.js';
export declare class Permissions {
    #private;
    group: string;
    source: () => Promise<PermissionEntity[]>;
    constructor(source: (() => Promise<PermissionEntity[]>) | string, group?: string);
    defaultSource(group: string): () => Promise<PermissionEntity[]>;
    load(): Promise<Permission[]>;
    get(name: string): Promise<Permission | undefined>;
    buildGroupPattern(group: string): string[];
    scope(privateScope: boolean): string;
    getOrSuper(name: string, scope: IPermissionScope): Promise<Permission | null>;
    test(currentPermission?: Permission | null, isAuthenticated?: boolean): Promise<boolean>;
}
