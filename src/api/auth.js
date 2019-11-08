import axios from 'axios';
import config from '../config';
const { authAPI } = config;

import {parseTokenStr} from '../utils/parse'
import {queryParams} from '../utils/query-params';


export function signIn(username, password) {
  const params = queryParams({username, password});
  return axios.post(authAPI, params)
    .then(res => {
      const token = res.data;
      storeToken('token', token);
      window.location.reload();
    })
}

export function signOut() {
  localStorage.removeItem('token');
  if (isAdmin()) localStorage.removeItem('su-token');
  window.location.reload();
}

export function isSignedIn() {
  const val = localStorage.getItem('token');
  return val !== null;
}

export function getUser() {
  if (!isSignedIn()) return null;
  return getUserName();
}

export function getToken() {
  return localStorage.getItem('token');
}

export function isAdmin() {
  const val = localStorage.getItem('su-token');
  return val !== null;
}

export function suSignIn(username, password, targetUser) {
  const params = queryParams({username, password, targetUser});
  return axios.post(`${authAPI}/sulogin`, params)
    .then(res => {
      const token = res.data;
      const adminToken = localStorage.getItem('token');

      storeToken('su-token', adminToken);
      storeToken('token', token);
      window.location.reload();
    })
}

export function suSwitchBack() {
  storeToken('token', localStorage.getItem('su-token'));
  localStorage.removeItem('su-token');
  window.location.reload();
}

/**
 * adminSignIn
 *  - this function is currently only used for systems dashboard prototype
 */
export function adminSignIn(username, password) {
  const params = queryParams({username, password, targetUser: username});
  return axios.post(`${authAPI}/sulogin`, params)
    .then(res => {
      const token = res.data;
      storeToken('token', token);
      window.location.reload();
    })
}

/**
 * helpers
 */
function getUserName() {
  const userID = parseTokenStr(localStorage.getItem('token')).un;
  const username = userID.split('@')[0];
  return username;
}

function storeToken(key, token) {
  localStorage.setItem(key, token);
}







