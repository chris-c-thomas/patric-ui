
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
  autoMeta: object
  userPerm: string
  public: boolean
  isWS: boolean
  linkRef: string
  permissions: [string[]]
}