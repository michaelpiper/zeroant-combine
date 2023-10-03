import { type Permissions } from './permissions.model.js';
import { type Next, type Context } from 'koa';
import { type IPermissionScope } from './permission.enum.js';
export declare class PolicyMiddleWare {
    #private;
    private readonly permissions;
    constructor(permissions: Permissions, group?: string);
    private get group();
    create: (ctx: Context, next: Next) => Promise<any>;
    createPublic: (ctx: Context, next: Next) => Promise<any>;
    createPrivate: (ctx: Context, next: Next) => Promise<any>;
    list: (ctx: Context, next: Next) => Promise<any>;
    listPublic: (ctx: Context, next: Next) => Promise<any>;
    listPrivate: (ctx: Context, next: Next) => Promise<any>;
    retrieve: (ctx: Context, next: Next) => Promise<any>;
    retrievePublic: (ctx: Context, next: Next) => Promise<any>;
    retrievePrivate: (ctx: Context, next: Next) => Promise<any>;
    delete: (ctx: Context, next: Next) => Promise<any>;
    deletePublic: (ctx: Context, next: Next) => Promise<any>;
    deletePrivate: (ctx: Context, next: Next) => Promise<any>;
    make: (name: string, scope?: IPermissionScope) => (ctx: Context, next: Next) => Promise<any>;
}
