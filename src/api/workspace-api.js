import axios from 'axios';
import config from '../config';

import { getToken } from '../api/auth-api';

const { wsAPI } = config;

const workspace = axios.create({
  headers: {
    Authorization: getToken()
  }
});

const rpc = (cmd, params) => {
  const req = {
    "id": String(Math.random()).slice(2),
    "method": `Workspace.${cmd}`,
    "params": [params],
    "jsonrpc": "2.0"
  }

  return workspace.post(wsAPI, req)
    .then(res => {
      return res.data.result[0];
    });
}


export function list(args) {
  if (typeof args !== 'object')
    throw Error('Workspace API: the "list" method requires an object');

  const {path, type, recursive = false, showHidden = false} = args;

  if (path == '/public/')
    return listPublic(args);

  const params = {
    "paths": [path],
    "recursive": recursive
  };

  if (type) params.query = {type};

  return rpc('ls', params)
    .then(data => {
      const meta = data[path];
      let objects = meta ? meta.map(m => metaToObj(m)) : [];

      if (!showHidden) {
        objects = objects.filter(obj => obj.name[0] != '.');
      }

      // we want to return folders followed by files
      const folders = objects.filter(obj => obj.type == 'folder').reverse();
      const files = objects.filter(obj => obj.type != 'folder'). reverse();
      return [...folders, ...files];
    })
}


export function listPublic({type, recursive = false, showHidden = false}) {
  const params = {
    "paths": ['/']
  };

  if (type) params.query = {type};

  return rpc('ls', params)
    .then(data => {
      const meta = data[path];
      let objects = meta ? meta.map(m => metaToObj(m)) : [];

      if (!showHidden) {
        objects = objects.filter(obj => obj.name[0] != '.');
      }

      // we only want truely public files (the ws api doesn't not provide this option)
      objects = objects.filter(obj => obj.owner != auth.user)

      // we want to return folders followed by files
      const folders = objects.filter(obj => obj.type == 'folder').reverse();
      const files = objects.filter(obj => obj.type != 'folder'). reverse();
      return [...folders, ...files];
    })
}

function metaToObj(m) {
  return {
    path: m[2] + m[0],
    name: m[0],
    parent: m[2],
    type: m[1],
    created: m[3],
    hash: m[4],
    owner: m[5],
    size: m[6],
    priv: m[9],
    public: m[10]
  };
}
