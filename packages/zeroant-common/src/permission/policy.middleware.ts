import { type Permissions } from './permissions.model.js'
import { ErrorCode, ErrorDescription } from '../constants.js'
import { type Next, type Context } from 'koa'
import { Forbidden } from 'zeroant-response/clientErrors/forbidden.clientError'
import { PermissionScope, type IPermissionScope } from './permission.enum.js'

export class PolicyMiddleWare {
  constructor(
    private readonly permissions: Permissions,
    group?: string
  ) {
    this.#group = group
  }

  readonly #group?: string
  private get group(): string {
    return this.#group ?? this.permissions.group
  }

  #name = (name: string) => {
    return this.group.concat('.').concat(name)
  }

  #create = (name: string, scope?: IPermissionScope) => {
    return async (ctx: Context, next: Next) => {
      await this.permissions.load()
      const permissions = ctx.state.permissions
      const permission = await permissions.getOrSuper(this.#name(name), scope ?? permissions.scope(ctx.state.user != null))
      if (!(await this.permissions.test(permission, ctx.state.user != null))) {
        throw new Forbidden(
          ErrorCode.FORBIDDEN,
          ErrorDescription.FORBIDDEN,
          `Access denied for ${this.#name(name)} permissions not available`
        )
      }
      return await next()
    }
  }

  create = this.#create('create', PermissionScope.public_or_private)
  createPublic = this.#create('create', PermissionScope.public)
  createPrivate = this.#create('create', PermissionScope.private)
  list = this.#create('list', PermissionScope.public_or_private)
  listPublic = this.#create('list', PermissionScope.public)
  listPrivate = this.#create('list', PermissionScope.private)
  retrieve = this.#create('retrieve', PermissionScope.public_or_private)
  retrievePublic = this.#create('retrieve', PermissionScope.public)
  retrievePrivate = this.#create('retrieve', PermissionScope.private)
  delete = this.#create('delete', PermissionScope.public_or_private)
  deletePublic = this.#create('delete', PermissionScope.public)
  deletePrivate = this.#create('delete', PermissionScope.private)
  make = this.#create
}
