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

/**
 * validateCompareType
 * @param {String} type option to be validated
 */
function validateCompareType(type) {
  const types = ['eq', 'neq', 'gt', 'lt', 'ge', 'le']

  if (!types.includes(type))
    throw `query: the provided compare type '${type}' is not valid.
      the accepted types are: ${types.join(',')}`
}

/**
 * getCompareStr
 * @param {String} type type of compare ('eq', 'neq', 'gt', etc)
 * @param {Object} compareObj key/value object where the value is
 *  is either a String or array of Strings
 *
 * example input:
 *  {genome_id, annotation: 'PATRIC'}
 */
function getCompareStr(type, compareObj) {
  validateCompareType(type)

  let parts = []
  for (const [k, v] of Object.entries(compareObj)) {
    // don't allow empty lists
    if (!v.length) {
      throw `\nquery: the query '${type}' param requires an object with
        a string or array as an value. The value provided was '${k}' was '${v}'`
    }

    // don't allow more than one value for greater/less than, etc
    if (['gt', 'lt', 'ge', 'le'].includes(type)) {
      if (v.length > 0)
        throw `\nquery: the query '${type}' param requires an object with
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

/**
 * validGroupOption
 * @param {String} opt option to validate
 */
function validateGroupFacet(type, opt) {
  const types = ['group', 'facet']

  if (!types.includes(type))
    throw `\nquery: the provided option type '${type}' is not valid.
      the accepted types are: ${types.join(',')}`

  console.log('type', type, opt)
  const opts = type == 'group' ?
    ['field', 'format', 'ngroups', 'limit', 'facet'] :
    ['field', 'mincount']

  if (!opts.includes(opt))
    throw `\nquery: the provided group option '${opt}' is not valid.
      the accepted types are: ${opts.join(',')}`
}

/**
 * getTupleStr
 * @param {String} type type of query ('facet', 'group', etc)
 * @param {Object} groupObj object to be turned in list of tuples strings
 *
 * example output:
 *   facet((field,pathway_id),(format,simple),(ngroups,true),(limit,1),(facet,true))
 */
function getTupleStr(type, groupObj) {
  let tupStrs = []
  for (const [k, v] of Object.entries(groupObj)) {
    validateGroupFacet(type, k)
    tupStrs.push(`(${k},${v})`)
  }

  return `${type}(${tupStrs.join(',')})`
}


/**
 * query
 * @param {Object} params
 *
 *  Note: the rql 'in' param has been made part of 'eq', 'neq', etc
 *  simply provide a list and 'in' will be used.
 */
export function query(params) {
  const {
    core = 'genome',
    solrInfo, // include solrInfo if true
    query,
    eq,
    neq,
    select,
    facet,
    group,
    limit = 25,
    start,
    sort,
    freeText, // free form
    json
  } = params

  const eqQuery = eq ? getCompareStr('eq', eq) : null
  const neqQuery = neq ? getCompareStr('neq', neq) : null
  const groupQuery = group ? getTupleStr('group', group) : null
  const facetQuery = facet ? getTupleStr('facet', facet) : null

  // const jsonQuery = json ? getTupleStr('json', json) : null

  const q = `?http_accept=application/${solrInfo ? 'solr+json': 'json'}`
    + (query ? `&keyword(${query})` : `&keyword(*)`)
    + (eqQuery ? `&${eqQuery}` : '')
    + (neqQuery ? `&${neqQuery}` : '')
    + (groupQuery ? `&${groupQuery}` : '')
    + (facetQuery ? `&${facetQuery}` : '')
    + (select ? `&select(${select.join(',')})` : '')
    + (start ? `&limit(${limit},${start-1})` : `&limit(${limit})`)
    + (sort ? `&sort(${sort})` : '')
    // + (jsonQuery ?  `&json(${encodeURIComponent(JSON.stringify(jsonQuery))}` : '')

  return api.get(`/${core}/${q}`)
    .then(res => solrInfo ? res : res.data)
}

