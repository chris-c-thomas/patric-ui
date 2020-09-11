import axios from 'axios'
import config from '../config'

import { getToken } from './auth'

const { wsAPI } = config

const workspace = axios.create({
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

  return workspace.post(wsAPI, req)
    .then(res => res.data.result[0])
}

export type WSObject = {
  encodedPath: string
  path: string
  name: string
  parent: string
  type: string
  created: Date
  hash: string
  owner: string
  size: string
  priv: string
  public: boolean
  isWS: boolean
}

function metaToObj(m: string[]) {
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
    priv: m[9],
    public: m[10] == 'r',
    isWS: (m[2].match(/\//g) || []).length == 2
    // permissions: (added below in a second 'list_permissions' request)
  }
}

type Args = {
  path: string;
  type?: string;
  recursive?: boolean;
  showHidden?: boolean;
  includeHidden?: boolean;
  includePermissions?: boolean;
}

export function list(args: Args) {
  if (typeof args !== 'object')
    throw Error('Workspace API: the "list" method requires an object')

  const {
    path,
    type,
    recursive = false,
    includeHidden = false,
    includePermissions = true
  } = args

  const params = {
    'paths': [path],
    'recursive': recursive,
    ...(type ? {query: {type: [type]}} : {})
  }
  console.log('params', params)

  return rpc('ls', params)
    .then(data => {
      const meta = data[path]
      let objects = meta ? meta.map((m) => metaToObj(m)) : []

      if (!includeHidden) {
        objects = objects.filter(obj => obj.path.indexOf('/.') == -1)
      }

      let permissionProm: Promise<any>
      if (includePermissions) {
        permissionProm = listPermissions(objects.map((o: { path: any }) => o.path))
      }

      return permissionProm.then((permHash: { [x: string]: any }) => {
        // join-in permissions if requested
        if (permHash) {
          objects = objects.map((obj: { path: string | number }) => ({...obj, permissions: permHash[obj.path]}))
        }

        // we want to return folders followed by files
        const folders = objects.filter((obj: { type: string }) => obj.type == 'folder').reverse()
        const files = objects.filter((obj: { type: string }) => obj.type != 'folder'). reverse()
        return [...folders, ...files]
      })
    })
}


function listPermissions(paths: any) {
  var objects = Array.isArray(paths) ? paths : [paths]

  return rpc('list_permissions', {objects})
}


export function createFolder(path) {

  return rpc('create', { objects: [[path, 'Directory']] })
    .then(res => res)
}



export function deleteObjects(objs: WSObject[], deleteJobData?: boolean) : Promise<any> {
  // get paths
  const paths = objs.map(o => o.path)

  // throw error for any special folder
  _omitSpecialFolders(paths, 'delete')

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

function _deleteJobData(paths: string[]) {
  paths = Array.isArray(paths) ? paths : [paths]

  // log what is happening so that console error is expected
  const proms = paths.map(function (path) {
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

function _omitSpecialFolders(paths, operation) {
  paths = Array.isArray(paths) ? paths : [paths]

  //  regect home workspaces (must check for anybody's home)
  var isHome = paths.filter((p) => {
    var parts = p.split('/')
    return parts.length == 3 && parts[2] == 'home'
  }).length

  if (isHome) {
    throw new Error('Your <i>home</i> workspace is a special workspace which cannot be ' + operation + 'd.')
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
    `/${user}@patricbrc.org/`,
    `/${user}@patricbrc.org/home/Genome Groups/`,
    `/${user}@patricbrc.org/home/Feature Groups/`,
    `/${user}@patricbrc.org/home/Experiment Groups/`,
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

