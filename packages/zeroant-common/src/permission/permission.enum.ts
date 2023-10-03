export const PermissionScope = {
  public: 'public',
  private: 'private',
  public_or_private: 'public_or_private'
}
export type IPermissionScope = (typeof PermissionScope)[keyof typeof PermissionScope]
