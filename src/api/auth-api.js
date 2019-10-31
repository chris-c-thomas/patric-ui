import axios from 'axios';
import config from '../config';
const { authAPI } = config;

import {parseTokenStr} from '../utils/parse'


export function signIn(user, pass, on401) {
  const params = `username=${user}&password=${pass}`;
  return axios.post(authAPI, params)
    .then(res => {
      const token = res.data;
      storeToken(token);
      window.location.reload();
    })
}

export function storeToken(token) {
  localStorage.setItem('token', token);

  const jsonStr = JSON.stringify(parseTokenStr(token));
  localStorage.setItem('auth', jsonStr);
}

export function signOut() {
  localStorage.removeItem('token');
  localStorage.removeItem('auth');
  window.location.reload();
}

export function isSignedIn() {
  const val = localStorage.getItem('token');
  return val !== null;
}

export function getUser() {
  if (!isSignedIn()) return null;
  const userID = JSON.parse(localStorage.getItem('auth')).un;
  const username = userID.split('@')[0];
  return username;
}

export function getToken() {
  return localStorage.getItem('token');
}
