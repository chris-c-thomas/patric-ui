import axios from 'axios'
import config from '../config'
const { authAPI } = config

import {parseTokenStr} from '../utils/parse'
import {queryParams} from '../utils/query-params'


export function signIn(
  username: string, password: string, reload: boolean = true
) : Promise<string> {
  const params = queryParams({username, password})
  return axios.post(authAPI, params)
    .then(res => {
      const token = res.data
      storeToken('token', token)

      if (reload)
        window.location.reload()

      return getUser(true)
    })
}


export function signOut() {
  localStorage.removeItem('token')
  if (isAdmin()) localStorage.removeItem('su-token')
  window.location.reload()
}


export function isSignedIn() {
  const val = localStorage.getItem('token')
  return val !== null
}


export function getUser(fullName: boolean = false) {
  if (!isSignedIn())
    return null
  return getUsername(fullName)
}


export function getToken() {
  if (isAdmin())
    return localStorage.getItem('su-token')
  return localStorage.getItem('token')
}


export function isAdmin() {
  const val = localStorage.getItem('su-token')
  return val !== null
}


export function suSignIn(username: string, password: string, targetUser: string) {
  const params = queryParams({username, password, targetUser})
  return axios.post(`${authAPI}/sulogin`, params)
    .then(res => {
      const token = res.data
      const adminToken = localStorage.getItem('token')

      storeToken('su-token', adminToken)
      storeToken('token', token)
      window.location.reload()
    })
}


export function suSwitchBack() {
  storeToken('token', localStorage.getItem('su-token'))
  localStorage.removeItem('su-token')
  window.location.reload()
}

/**
 * adminSignIn
 *  - this function is currently only used for systems dashboard prototype
 */
export function adminSignIn(username: string, password: string) {
  const params = queryParams({username, password, targetUser: username})
  return axios.post(`${authAPI}/sulogin`, params)
    .then(res => {
      const token = res.data
      storeToken('token', token)
    })
}

/**
 * helpers
 */
function getUsername(fullName: boolean) {
  const userID = parseTokenStr(localStorage.getItem('token')).un
  const username = fullName ? userID : userID.split('@')[0]
  return username
}

function storeToken(key: string, token: string) {
  localStorage.setItem(key, token)
}







