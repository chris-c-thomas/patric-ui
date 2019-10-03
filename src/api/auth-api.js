import axios from 'axios';
import config from '../config';
const { authAPI } = config;

import {parseTokenStr} from '../utils/parse'


export function signIn(user, pass) {
  const params = `username=${user}&password=${pass}`;
  return axios.post(authAPI, params)
    .then(res => {
      const token = res.data;
      storeToken(token);
      return token;
    })
}

export function storeToken(token) {
  const jsonStr = JSON.stringify(parseTokenStr(token));
  localStorage.setItem('auth', jsonStr);
}

export function signOut() {
  localStorage.removeItem('auth');
  window.location.reload();
}

export function isSignedIn() {
  const val = localStorage.getItem('auth');
  return val !== null;
}

export function getUser() {
  const user = JSON.parse(localStorage.getItem('auth')).un;
  return user;
}

