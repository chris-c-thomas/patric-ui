import axios from 'axios';
import config from '../config';
const { ws } = config;

const TOKEN = "un=nconrad@patricbrc.org|tokenid=7f5ef6d4-ee72-4d33-b3d5-235009af4ec3|expiry=1581388886|client_id=nconrad@patricbrc.org|token_type=Bearer|realm=patricbrc.org|scope=user|roles=admin|SigningSubject=https://user.patricbrc.org/public_key|sig=b64f4e202249f96bc47d62d3edfb5af5914a0275b14ac7994273fa54ce6f9061c9b36e2b6f8a9d588a1f159ce8bcd79f0a57e953e97626f25796f2a8bfadc9b7eb6db3e0218faa09606bdebb3b0d0265ede91dd4e5bf7cf9b656afffe796d4bf0750f950b79dcef7d09b1ece252e1249b6ed2efe8b453658c3de8e9cfc0a3a5e";

const workspace = axios.create({
  headers: {
    Authorization: TOKEN
  }
});


const RPC = (cmd, params) => {
  const req = {
    "id": 7, // should be random
    "method": `Workspace.${cmd}`,
    "params": [params],
    "jsonrpc": "2.0"
  }

  return workspace.post(ws, req)
    .then(res => {
      return res.data.result[0];
    });
}


export function list({path, type, recursive = false}) {
  const params = {
    "paths": [path],
    "recursive": recursive
  };

  if (type) params.query = {type};

  return RPC('ls', params)
    .then(data => {
      const meta = data[path];
      return meta.map(m => metaToObj(m));;
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
