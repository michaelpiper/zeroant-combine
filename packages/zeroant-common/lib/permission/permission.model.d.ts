import { ModelFactory } from 'zeroant-factory/model.factory';
import { type PermissionEntity } from './permission.entity.js';
import { type IPermissionScope } from './permission.enum.js';
export declare class Permission extends ModelFactory {
    ref: string;
    title: string | null;
    name: string;
    group: string;
    scope: IPermissionScope;
    description: string | null;
    enabled: boolean;
    createdAt: Date;
    updatedAt: Date;
    static fromEntity(entity: PermissionEntity): Permission;
    get toEntity(): PermissionEntity;
}
