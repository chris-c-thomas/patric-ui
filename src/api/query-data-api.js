/**
 *  This module is curently used for scripting,
 *  but could evolve into a generic helpers.
 *
 *  Note: the rql 'in' param has been made part of 'eq', 'neq', etc.
 *    Simply provide a list and 'in' will be used.
 **/

import axios from 'axios';

import config from '../config';
const { dataAPI } = config;

const api = axios.create({
  baseURL: dataAPI
})

function validateCompareType(type) {
  const types = ['eq', 'neq', 'gt', 'lt', 'ge', 'le']

  if (!types.includes(type))
    throw `query: the provided compare type '${type}' is not valid.
      the accepted types are: ${types.join(',')}`
}


function getCompareStr(compareObj, type) {
  validateCompareType(type)

  let parts = []
  for (const [k, v] of Object.entries(compareObj)) {
    // don't allow empty lists
    if (!v.length) {
      throw `query: the query '${type}' param requires an object with
        a string or array as an value. The value provided was '${k}' was '${v}'`
    }

    // don't allow more than one value for greater/less than, etc
    if (['gt', 'lt', 'ge', 'le'].includes(type)) {
      if (v.length > 0)
        throw `query: the query '${type}' param requires an object with
          with values that are single strings. The value provided for '${k}' was '${v}'`
    }

    // now form the appropriate eq, neq, in query
    let str
    if (typeof v === 'string' || v.length == 1) {
      str = `${type}(${k},${v})`
    } else if (Array.isArray(v)){
      if (type === 'eq')
        str = `in(${k},(${v.join(',')}))`
      else if (type === 'neq')
        str = `not(in(${k},(${v.join(',')})))`
      else
        throw `query: the ${type} option is currently not
          supported by the query helper for arrays.`
    } else {
      throw `query: the ${type} option is currently not
        supported by the query helper for '${k}' was '${v}'`
    }
    parts.push(str)
  }

  return parts.join('&')
}


function validGroupOption(opt) {
  const opts = ['field', 'format', 'ngroups', 'limit', 'facet']

  if (!opts.includes(opt))
    throw `query: the provided group option '${opt}' is not valid.
      the accepted types are: ${opts.join(',')}`
}


/**
 * getGroupStr
 * takes and object, returns rql group string
 *
 *  example output:
 *   &group((field,pathway_id),(format,simple),(ngroups,true),(limit,1),(facet,true))
 **/
function getGroupStr(groupObj) {
  console.log('obj', groupObj)
  let tupStrs = []
  for (const [k, v] of Object.entries(groupObj)) {
    validGroupOption(k)
    tupStrs.push(`(${k},${v})`)
  }

  return `group(${tupStrs.join(',')})`
}


/**
 *  This function is curently used for scripting,
 *  but could evolve into a generic call.
 *
 *  Note: the rql 'in' param has been made part of 'eq', 'neq', etc
 *    simply provide a list and 'in' will be used.
 **/
export function query(params) {
  const {
    core = 'genome',
    eq,
    neq,
    select,
    group,
    limit = 25,
    start,
    sort,
    solrInfo
  } = params

  const eqQuery = eq ? getCompareStr(eq, 'eq') : null
  const neqQuery = neq ? getCompareStr(neq, 'neq') : null
  const groupQuery = group ? getGroupStr(group) : null
  console.log('groupQuery', groupQuery)

  const q = `?http_accept=application/${solrInfo ? 'solr+json': 'json'}`
    + `&keyword(*)`
    + (eqQuery ? `&${eqQuery}` : '')
    + (neqQuery ? `&${neqQuery}` : '')
    + (groupQuery ? `&${groupQuery}` : '')
    + (select ? `&select(${select.join(',')})` : '')
    + (start ? `&limit(${limit},${start-1})` : `&limit(${limit})`)
    + (sort ? `&sort(${sort})` : '')

  console.log('q', q)
  return api.get(`/${core}/${q}`).then(res => res.data)
}

