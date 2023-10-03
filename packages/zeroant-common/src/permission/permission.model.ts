import { ModelFactory } from 'zeroant-factory/model.factory'
import { type PermissionEntity } from './permission.entity.js'
import { type IPermissionScope } from './permission.enum.js'
export class Permission extends ModelFactory {
  ref: string
  title: string | null
  name: string
  group: string
  scope: IPermissionScope
  description: string | null
  enabled: boolean
  createdAt: Date
  updatedAt: Date

  static fromEntity(entity: PermissionEntity) {
    const model = new Permission()
    model.id = entity.permission_id
    model.ref = entity.permission_ref
    model.title = entity.permission_title
    model.name = entity.permission_name
    model.group = entity.permission_group
    model.scope = entity.permission_scope
    model.description = entity.permission_description
    model.enabled = entity.permission_enabled
    model.createdAt = entity.permission_created_at
    model.updatedAt = entity.permission_updated_at
    return model
  }

  get toEntity(): PermissionEntity {
    return {
      permission_id: this.id,
      permission_ref: this.ref,
      permission_title: this.title,
      permission_name: this.name,
      permission_group: this.group,
      permission_scope: this.scope,
      permission_description: this.description,
      permission_enabled: this.enabled,
      permission_created_at: this.createdAt,
      permission_updated_at: this.updatedAt
    }
  }
}
