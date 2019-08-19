import axios from 'axios';
import config from '../config';
const { wsAPI } = config;

import auth from '../../token.js';


const workspace = axios.create({
  headers: {
    Authorization: auth.token
  }
});


const rpc = (cmd, params) => {
  const req = {
    "id": 7, // should be random
    "method": `Workspace.${cmd}`,
    "params": [params],
    "jsonrpc": "2.0"
  }

  return workspace.post(wsAPI, req)
    .then(res => {
      console.log('server response', res.data)
      return res.data.result[0];
    });
}


export function list({path, type, recursive = false, showHidden = false}) {
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
      const folders = objects.filter(obj => obj.type == 'folder');
      const files = objects.filter(obj => obj.type != 'folder');
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
