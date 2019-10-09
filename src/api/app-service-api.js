import axios from 'axios';
import config from '../config';
const { appServiceAPI } = config;

import {getToken} from '../api/auth-api';


const api = axios.create({
  headers: {
    Authorization: getToken()
  }
});


const rpc = (cmd, params) => {
  const req = {
    "id": String(Math.random()).slice(2),
    "method": `AppService.${cmd}`,
    "params": params || [],
    "jsonrpc": "2.0"
  }

  return api.post(appServiceAPI, req)
    .then(res => {
      return res.data.result[0];
    });
}


export function getStatus() {
  return rpc('query_task_summary')
}

export function listJobs() {
  return rpc('enumerate_tasks', [0, 30000])
}
