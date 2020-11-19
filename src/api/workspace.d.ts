
export type WSObject = {
  encodedPath: string
  path: string
  name: string
  parent: string
  type: string
  created: Date
  hash: string
  owner: string
  size: number
  userMeta: object
  autoMeta: any
  userPerm: string
  isPublic: boolean
  isWS: boolean
  linkRef: string
  permissions: Permissions
}


export type Permission = 'r' | 'w' | 'o' | 'n'

export type Permissions = [userName: string, permission: Permission][]

export type PermissionObj = {
  [path: string]: Permissions
}