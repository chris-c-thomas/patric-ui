
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
  permissions: [string[]]
}