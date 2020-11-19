import axios from 'axios'
import config from '../config'
import { getToken, getUser } from './auth'

// types
import {
  WSObject, Permission, PermissionObj
} from './workspace.d'


const workspace = axios.create({
  timeout: config.timeout,
  headers: {
    Authorization: getToken()
  }
})


const rpc = (cmd: string, params: object) => {
  const req = {
    id: String(Math.random()).slice(2),
    method: `Workspace.${cmd}`,
    params: [params],
    jsonrpc: '2.0'
  }

  return workspace.post(config.wsAPI, req)
    .then(res => res.data.result[0])
}



function metaToObj(m) : WSObject {
  const path = m[2] + m[0]
  return {
    // encode everything but user's root
    encodedPath: path.split('/')
      .map((p, i) => i == 1 ? p : encodeURIComponent(p)).join('/'),
    path,
    name: m[0],
    parent: m[2],
    type: m[1],
    created: m[3],
    hash: m[4],
    owner: m[5],
    size: m[6],
    userMeta: m[7],
    autoMeta: m[8],
    userPerm: m[9],
    isPublic: m[10] == 'r',
    linkRef: m[11],
    isWS: (m[2].match(/\//g) || []).length == 2,
    permissions: null // (added below in a second 'list_permissions' request)
  }
}



type ListArgs = {
  path: string;
  type?: string;
  recursive?: boolean;
  showHidden?: boolean;
  includePermissions?: boolean;
  onlyPublic?: boolean
  onlySharedWithMe?: boolean
}

export async function list(args: ListArgs) {
  if (typeof args !== 'object')
    throw Error('Workspace API: the "list" method requires an object')

  const {
    path,
    type,
    recursive = false,
    showHidden = false,
    includePermissions = true,
    onlyPublic = false,
    onlySharedWithMe = false
  } = args

  const params = {
    'paths': [path],
    'recursive': recursive,
    ...(type ? {query: {type: [type]}} : {})
  }

  const data = await rpc('ls', params)
  const meta = data[path]

  let objects = meta ? meta.map((m) => metaToObj(m)) : []

  if (!showHidden) {
    objects = objects.filter(obj => obj.name.charAt(0) != '.')
  }

  if (onlyPublic) {
    console.log('onlypublic', onlyPublic)
    objects = objects.filter(obj => obj.isPublic)
  }

  if (onlySharedWithMe) {
    objects = objects.filter(obj => obj.owner !== getUser(true) && !obj.isPublic)
  }

  let permObj: PermissionObj
  if (includePermissions) {
    permObj = await listPermissions(objects.map(o => o.path))
    objects = objects.map((obj) => ({...obj, permissions: permObj[obj.path]}))
  }

  // we want to return folders followed by files
  const folders = objects.filter((obj) => obj.type == 'folder').reverse()
  const files = objects.filter((obj) => obj.type != 'folder'). reverse()
  return [...folders, ...files]
}



function listPermissions(paths: string | string[]) : Promise<PermissionObj> {
  const objects = Array.isArray(paths) ? paths : [paths]

  return rpc('list_permissions', {objects})
}



export async function getMeta(path: string) : Promise<WSObject> {
  const res = await rpc('get', {objects: [path], metadata_only: true})
  const meta = metaToObj(res[0][0])
  return meta
}



export async function getType(path: string) {
  const meta = await getMeta(path)
  return meta.type
}



export async function isFile(path: string) {
  const type = await getType(path)
  return type !== 'folder'
}



type GetReturnType = Promise<{meta: WSObject, data: object | string}>

export async function getObject(path: string) : GetReturnType {
  const res = await rpc('get', {objects: [path]})
  const meta = metaToObj(res[0][0])


  // if there's a object ref, fetch it
  if (meta.linkRef) {
    let headers = {
      Authorization: getToken() ? 'OAuth ' + getToken() : null
    }

    try {
      const {data} = await axios.get(meta.linkRef + '?download', {headers})
      return { meta, data }
    } catch (err) {
      return {
        meta,
        data: `Sorry, there was an issue fetching your data from shock.  The file size was ${meta.size} bytes.`
      }
    }
  }

  let data = res[0][1]
  try {
    data = JSON.parse(res[0][1])
  } catch (e) {
    // pass
  }

  let result = {
    meta,
    data
  }

  return result
}



export async function getDownloadUrls(paths: string | string[]) {
  paths = paths instanceof Array ? paths : [paths]
  const urls =  await rpc('get_download_url', { objects: paths })
  return urls[0]
}



export function createFolder(path) {
  return rpc('create', { objects: [[path, 'Directory']] })
    .then(res => res)
}



export function deleteObjects(objs: WSObject[], deleteJobData?: boolean) : Promise<any> {
  // get paths
  const paths = objs.map(o => o.path)

  // throw error for any special folder
  omitSpecialFolders(paths, 'delete')

  // delete objects prom
  const prom = rpc('delete', {
    objects: paths,
    force: true,
    deleteDirectories: true
  })

  if (!deleteJobData)
    return prom

  // figure out any potential hidden job folders (Which may or may not be there)
  if (deleteJobData) {
    const hiddenFolders = objs
      .filter(o => o.type == 'job_result')
      .map(o => o.path)

    if (hiddenFolders.length) {
      const allProms = Promise.all([prom, ..._deleteJobData(hiddenFolders)])
      return allProms
    } else {
      return prom
    }
  }
}



function _deleteJobData(paths: string | string[]) {
  paths = Array.isArray(paths) ? paths : [paths]

  const proms = paths.map(path => {
    const parts = path.split('/'),
      jobName = parts.pop(),
      dotPath = parts.join('/') + '/.' + jobName

    return rpc('delete', {
      objects: [dotPath],
      force: true,
      deleteDirectories: true
    })
  })

  return proms
}


type Operation = 'delete' | 'move' | 'rename'

export function omitSpecialFolders(paths: string | string[], operation: Operation) {
  paths = Array.isArray(paths) ? paths : [paths]

  // regect home workspaces (must check for anybody's home)
  const isHome = paths.filter((p) => {
    let parts = p.split('/')
    return parts.length == 3 && parts[2] == 'home'
  }).length

  if (isHome) {
    throw new Error(`Your <i>home</i> workspace is a special workspace which cannot be ${operation}d.`)
  }

  // also reject these home folders
  const unacceptedFolders = [
    'Genome Groups',
    'Feature Groups',
    'Experiments',
    'Experiment Groups'
  ]

  const unacceptedPaths = paths.filter((p) => {
    var parts = p.split('/')
    if (parts.length == 4 && parts[2] == 'home' && unacceptedFolders.indexOf(parts[3]) != -1)
      return true
  })

  if (unacceptedPaths.length) {
    throw `You cannot ${operation} any of the following special folders:<br><br>` +
      `<i>${unacceptedFolders.join('<br>')} </i>`
  }
}



export function getUserCounts({user}) {
  const paths = [
    `/${user}/`,
    `/${user}/home/Genome Groups/`,
    `/${user}/home/Feature Groups/`,
    `/${user}/home/Experiment Groups/`,
  ]

  const params = {
    'paths': paths
  }

  return rpc('ls', params)
    .then(data => {
      return paths.reduce((accum, path) => {
        accum[path] = (path in data && data[path]).length || 0
        return accum
      }, {})
    })
}



export async function create(
  obj: WSObject,
  createUploadNodes: boolean = false,
  overwrite: boolean = false,
  content: any = ''
) {
  if (obj.path.charAt(obj.path.length - 1) != '/') {
    obj.path += '/'
  }

  return rpc('create', {
    objects: [[(obj.path + obj.name), (obj.type || 'unspecified'), obj.userMeta || {}, content]],
    createUploadNodes,
    overwrite
  }).then((results) => {
    if (!results[0]) {
      throw 'Error Creating Object'
    } else {
      return metaToObj(results[0])
    }
  })
}



export function updateMetadata(objs: WSObject[]) {
  objs = Array.isArray(objs) ? objs : [objs]

  const objects = objs.map(obj => [obj.path, obj.userMeta, obj.type || undefined])

  // note: update_metadata will replace userMeta
  return rpc('update_metadata', { objects })
    .then(res => res[0])
}



export function updateAutoMetadata (paths: string | string[]) {
  paths = Array.isArray(paths) ? paths : [paths]
  return rpc('update_auto_meta', { objects: paths })
}



export function permissionMap(perm: Permission) {
  const mapping = {
    'n': 'No access',
    'r': 'Can view',
    'w': 'Can edit',
    'a': 'Admin'
  }
  return mapping[perm]
}


