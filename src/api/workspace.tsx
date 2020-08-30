import axios from 'axios'
import config from '../config'

import { getToken } from './auth'

const { wsAPI } = config

const workspace = axios.create({
  headers: {
    Authorization: getToken()
  }
})


const rpc = (cmd: string, params: { paths?: any[] | string[]; recursive?: any; objects?: any[] }) => {
  const req = {
    id: String(Math.random()).slice(2),
    method: `Workspace.${cmd}`,
    params: [params],
    jsonrpc: '2.0'
  }

  return workspace.post(wsAPI, req)
    .then(res => {
      return res.data.result[0]
    })
}

function metaToObj(m: string[]) {
  const path = m[2] + m[0]
  return {
    // encode everything but user's root
    encodedPath: path.split('/').map((p: string | number | boolean, i: number) => i == 1 ? p : encodeURIComponent(p)).join('/'),
    path,
    name: m[0],
    parent: m[2],
    type: m[1],
    created: m[3],
    hash: m[4],
    owner: m[5],
    size: m[6],
    priv: m[9],
    public: m[10] == 'r'
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

export function list(args) {
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
    'recursive': recursive
  }

  if (type)
    params.query = {type}

  return rpc('ls', params)
    .then(data => {
      const meta = data[path]
      let objects = meta ? meta.map((m: any) => metaToObj(m)) : []

      if (!includeHidden) {
        objects = objects.filter((obj: { name: string[] }) => obj.name[0] != '.')
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

