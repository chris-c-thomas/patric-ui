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
      return res.data.result;
    });
}

export function getStatus() {
  return rpc('query_task_summary')
    .then(data => data[0])
}

export function listJobs({start = 0, limit = 200, query = {}}) {
  return rpc('enumerate_tasks_filtered', [start, limit, query])
    .then(data => ({
      jobs: data[0],
      total: Number(data[1])
    }))
}
