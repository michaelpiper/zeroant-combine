import { type IPermissionScope } from './permission.enum.js'

export interface PermissionEntity {
  permission_id: number
  permission_ref: string
  permission_name: string
  permission_group: string
  permission_scope: IPermissionScope
  permission_title: string | null
  permission_description: string | null
  permission_enabled: boolean
  permission_created_at: Date
  permission_updated_at: Date
}
