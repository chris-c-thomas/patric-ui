import axios from 'axios';
import config from '../config';
const { appServiceAPI } = config;

import {getToken} from './auth';



const api = axios.create({
  headers: {
    Authorization: getToken()
  }
});

const rpc = (cmd, params) => {
  const req = {
    id: String(Math.random()).slice(2),
    method: `AppService.${cmd}`,
    params: params || [],
    jsonrpc: "2.0"
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


export function getStats() {
  return rpc('query_app_summary')
    .then(([data]) => {
      return Object.keys(data).map(key => ({
        label: `${key} (${data[key]})`,
        value: key,
        count: data[key],
      })).sort((a, b) => (a.count < b.count) ? 1 : -1)
    })
}


export function listJobs({start = 0, limit = 200, simpleSearch = {}}) {
  // note query may be null object
  return rpc('enumerate_tasks_filtered', [start, limit, simpleSearch ? simpleSearch : {}])
    .then(data => ({
      jobs: data[0],
      total: data[1]
    }))
}


export function submitApp(appName, values) {
  return rpc('start_app', [appName, values])
}

