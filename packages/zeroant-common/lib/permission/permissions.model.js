import { Permission } from './permission.model.js';
import { BadRequest } from 'zeroant-response/clientErrors/badRequest.clientError';
import { ErrorCode, ErrorDescription } from '../constants.js';
import { PermissionScope } from './permission.enum.js';
import { CacheManagerPlugin, CacheOrAsyncStrategy } from '../plugins/cacheManger.plugin.js';
import { TtlUtils } from 'zeroant-util/ttl.util';
export class Permissions {
    #data = [];
    #loading = false;
    group;
    source;
    constructor(source, group) {
        this.source = typeof source === 'string' ? this.defaultSource(source) : source;
        this.group = typeof source === 'string' ? source : group;
        if (typeof this.group !== 'string') {
            throw new BadRequest(ErrorCode.INVALID_ARGUMENT, ErrorDescription.INVALID_ARGUMENT, 'please provide group as argument to constructor e.g new Permissions("permission") or new Permissions(dataSourceFunction:()=>PermissionEntity[],"permission") ');
        }
    }
    defaultSource(group) {
        return async () => {
            const { zeroant } = await import('zeroant-loader/zeroant');
            const { DBPlugin } = await import('../plugins/db.plugin.js');
            const db = zeroant.getPlugin(DBPlugin);
            const repository = db.repository('permission');
            const permissions = await repository.findMany({
                where: {
                    permission_group: group
                }
            });
            return permissions;
        };
    }
    async #getOrCreatePermission(name, scope) {
        const { zeroant } = await import('zeroant-loader/zeroant');
        const { DBPlugin } = await import('../plugins/db.plugin.js');
        const db = zeroant.getPlugin(DBPlugin);
        const repository = db.repository('permission');
        const cache = zeroant.getPlugin(CacheManagerPlugin);
        const groupFromName = name.split('.').at(0);
        const permission = await cache.withStrategy(new CacheOrAsyncStrategy()
            .setKey(`permissions:policy:${groupFromName}:${name}:${scope}`)
            .setTtl(TtlUtils.oneMinute)
            .setSource(async () => await repository.upsert({
            create: {
                permission_group: groupFromName,
                permission_name: name,
                permission_scope: scope,
                permission_enabled: true,
                permission_title: `${name} ${scope}`,
                permission_description: `${name} ${scope} (Auto Generated)`
            },
            where: {
                permission_name_permission_scope: {
                    permission_name: name,
                    permission_scope: scope
                }
            },
            update: {}
        })));
        return permission;
    }
    async load() {
        if (this.#loading) {
            return this.#data;
        }
        if (this.#data.length > 0) {
            return this.#data;
        }
        this.#loading = true;
        const { zeroant } = await import('zeroant-loader/zeroant');
        const cache = zeroant.getPlugin(CacheManagerPlugin);
        const entities = await cache.withStrategy(new CacheOrAsyncStrategy()
            .setKey(`permissions:policy:${this.group}`)
            .setTtl(TtlUtils.oneMinute)
            .setSource(async () => await this.source()));
        this.#loading = false;
        this.#data = entities.map((entity) => Permission.fromEntity(entity));
        return this.#data;
    }
    async get(name) {
        await this.load();
        const permission = this.#data.find((permission) => permission.name === name);
        return permission;
    }
    buildGroupPattern(group) {
        const list = [];
        const groups = group.split('.');
        for (let i = 0; i < groups.length - 1; i++) {
            const key = groups[i];
            if (list.length === 0) {
                list.push(key);
            }
            else {
                list.push(list[list.length - 1] + '.' + key);
            }
        }
        return list.map((name) => name.concat('.*'));
    }
    scope(privateScope) {
        if (privateScope) {
            return PermissionScope.private;
        }
        return PermissionScope.public;
    }
    async getOrSuper(name, scope) {
        await this.load();
        const patterns = this.buildGroupPattern(name);
        let permission;
        if (scope !== undefined) {
            permission = this.#data.find((permission) => permission.name === name && permission.scope === scope);
            if (permission !== undefined) {
                return permission;
            }
        }
        permission = this.#data.find((permission) => permission.name === name && permission.scope === PermissionScope.public_or_private);
        if (permission !== undefined) {
            return permission;
        }
        permission = this.#data.find((permission) => permission.name === '*' &&
            (permission.scope === scope ||
                (permission.scope === PermissionScope.public && scope === PermissionScope.public_or_private) ||
                permission.scope === PermissionScope.public_or_private));
        if (permission !== undefined) {
            let entity = await this.#getOrCreatePermission(name, scope);
            if (entity != null) {
                return Permission.fromEntity(entity);
            }
            entity = await this.#getOrCreatePermission(name, PermissionScope.public_or_private);
            if (entity != null) {
                return Permission.fromEntity(entity);
            }
        }
        permission = this.#data.find((permission) => (permission.scope === scope ||
            (permission.scope === PermissionScope.public && scope === PermissionScope.public_or_private) ||
            permission.scope === PermissionScope.public_or_private) &&
            typeof permission.group === 'string' &&
            patterns.includes(permission.group.concat('.*')));
        if (permission !== undefined) {
            let entity = await this.#getOrCreatePermission(name, scope);
            if (entity != null) {
                return Permission.fromEntity(entity);
            }
            entity = await this.#getOrCreatePermission(name, PermissionScope.public_or_private);
            if (entity != null) {
                return Permission.fromEntity(entity);
            }
        }
        await this.#getOrCreatePermission(name, scope);
        return null;
    }
    async test(currentPermission, isAuthenticated = false) {
        await this.load();
        if (currentPermission === null || currentPermission === undefined) {
            return false;
        }
        if (!currentPermission.enabled) {
            return false;
        }
        if (currentPermission.scope === PermissionScope.public || currentPermission.scope === PermissionScope.public_or_private) {
            return true;
        }
        if (this.#data.findIndex((permission) => permission.id === currentPermission.id) === -1) {
            return false;
        }
        if (!isAuthenticated) {
            return false;
        }
        return true;
    }
}
//# sourceMappingURL=permissions.model.js.map