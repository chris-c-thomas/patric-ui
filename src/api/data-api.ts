
/**
 * Todo: create query builder
*/

import axios from 'axios'
import config from '../config'
const { dataAPI } = config
import {getToken} from './auth'

import { query as Query} from './data-api-req'

import { metaObjToList } from '../charts/chart-helpers'


const api = axios.create({
  baseURL: dataAPI,
  headers: {
    Authorization: getToken()
  }
})

const cache = new Map()

// config for POST requests
api.defaults.headers.post['Content-Type'] = 'application/rqlquery+x-www-form-urlencoded'
api.defaults.headers.post['Accept'] = 'application/solr+json'

// GET request config strings
const acceptSolr = `http_accept=application/solr+json`  // string for including solr request meta
const solrConfigStr = 'http_content-type=application/solrquery+x-www-form-urlencoded'


type ConfigParams = {
  start?: number
  limit?: number
  contentType?: string
  data?: any
}

// helper for when Solr query strings are used.
function getSolrConfig({start = null, limit, contentType, data}: ConfigParams) {
  let config = {
    headers: {},
    data: {}
  }

  if (start != null && limit) {
    config.headers['Range'] = `items=${start}-${start+limit}`
  }

  // Note! If putting content-type in the request, the body must
  // have content. This configuration is not currently used,
  // but if it is, config.data should have at least an emtpy object.
  if (contentType) {
    config.headers['Content-Type'] = contentType
    config.data = data || {}
  }

  return config
}


/**
 * Data API helpers
 */

// todo: replace with "Query"?
export function listRepresentative({taxonID,  limit=10000}) {
  const q = `?eq(taxon_lineage_ids,${taxonID})&or(eq(reference_genome,*))` +
    `&select(genome_id,reference_genome,genome_name)` +
    `&facet((field,reference_genome),(mincount,1))&json(nl,map)` +
    `&limit(${limit})` +
    `&${acceptSolr}`

  return api.get(`/genome/${q}`)
    .then(res => {
      let docs = res.data.response.docs
      return docs
    })
}


// todo: replace with "Query"?
export function getAMRCounts() {
  console.warn('Note: The AMR Overview Counts still need to be fixed.')
  const kinds = 'Resistant,Susceptible,Intermediate'
  const pivot = 'antibiotic,resistant_phenotype,genome_id'

  const q = //`in(genome_id,(${genomeIDs.join(',')}))` +
  `in(resistant_phenotype,(${kinds}))` +
  `&limit(1)&facet((pivot,(${pivot})),(mincount,1),(limit,-1))` +
  `&json(nl,map)`

  return api.post(`/genome_amr/`, q)
    .then(res => {
      const pivots = res.data.facet_counts.facet_pivot[pivot]

      // convert nested objects into list of objects
      return pivots.map(drug => {
        const obj = {}
        drug.pivot.forEach(item => {
          obj[item.value] = item.count
        })
        return {
          drug: drug.value,
          total: drug.count,
          ...obj
        }
      }).sort((a, b) => (a.total < b.total) ? 1 : -1)
    })
}


// todo: replace with "Query"?
export function getTaxonChartData({taxonID}) {
  const q = `?eq(taxon_lineage_ids,${taxonID})` +
    `&facet((field,host_name),(field,disease),(field,genome_status),(field,isolation_country),(mincount,1))` +
    `&limit(1)&json(nl,map)` +
    `&${acceptSolr}`

  return api.get(`/genome/${q}`)
    .then(res => {
      const obj = res.data.facet_counts.facet_fields

      return {
        host_name: metaObjToList(obj.host_name),
        disease: metaObjToList(obj.disease),
        genome_status: metaObjToList(obj.genome_status),
        isolation_country: metaObjToList(obj.isolation_country)
      }
    })
}

export function getGenomeMeta(genome_id) {
  return Query({core: 'genome', eq: {genome_id}})
    .then(data => data[0])
}

const boostQuery = [
  'taxon_rank:superkingdom^7000000', 'taxon_rank:phylum^6000000', 'taxon_rank:class^5000000',
  'taxon_rank:order^4000000', 'taxon_rank:family^3000000', 'taxon_rank:genus^2000000',
  'taxon_rank:species^1000000', 'taxon_rank:*'
]

// todo: replace with "Query"?
export function queryTaxon({query, start = 0, limit = 25}) {
  const q =
    `?q=((taxon_name:*${query}*)%20OR%20(taxon_name:${query}))%20AND%20` +
    boostQuery.join('%20OR%20') +
    `&fl=taxon_name,taxon_id,taxon_rank,lineage_names&qf=taxon_name&${solrConfigStr}`

  const config = getSolrConfig({start, limit})
  return api.get(`/taxonomy${q}`, config)
    .then(res => {
      return res.data
    })
}


const parseFacets = (facetList) => {
  const data = []

  let obj: any = {}
  for (let i = 0; i < facetList.length; i++) {
    if (i % 2 == 0) {
      obj.name = facetList[i]
    } else {
      obj.count = facetList[i]
      data.push(obj)
      obj = {}
    }
  }

  return data
}

type FacetParams = {
  core: string           // core to facet on
  field: string          // field to facet on
  taxonID?: string       // taxonID, or
  genomeID?: string      // genomeID
  filterStr?: string     // optional RQL string
  genomeIDs?: string[]   // genomeIDs (for non-genome core query)
}


export async function getFacets(params: FacetParams) {
  const {
    core,
    field,
    taxonID,
    genomeID,
    filterStr,
    genomeIDs
  } = params

  if (!taxonID && !genomeID)
    throw 'getFacets() expects either a `taxonID` or `genomeID`'

  // build query string based on params
  let q

  // if faceting the genome core, facet everything below taxon
  if (core == 'genome' && taxonID && filterStr) {
    q = `and(eq(taxon_lineage_ids,${taxonID}),${filterStr})`

  } else if (core == 'genome' && taxonID) {
    q = `eq(taxon_lineage_ids,${taxonID})`


  // otherwise, filter on provided genomeIDs
  } else if (filterStr && taxonID && genomeIDs) {
    q = `and(in(genome_id,(${genomeIDs.join(',')})),${filterStr})`

  } else if (taxonID && genomeIDs) {
    q = `and(in(genome_id,(${genomeIDs.join(',')})))`
  }

  // cases for if genomeID is specified (i.e., for genome view)
  else if (filterStr && genomeID) {
    q = `eq(genome_id,${genomeID}),${filterStr})`

  } else if (genomeID) {
    q = `eq(genome_id,${genomeID})`

  } else {
    throw 'getFacets(): no condition met!'
  }

  q += `&limit(1)&facet((field,${field}),(mincount,1))&select(genome_id)`

  const res = await api.post(`/${core}`, q)
  return parseFacets(res.data.facet_counts.facet_fields[field])
}


type StatsParams = {
  core: string
  field: string
}

// /genome/select?q=public:true%20AND%20owner:PATRIC*&wt=json&stats=true&stats.field=genome_length&stats.field=patric_cds&stats.field=patric_cds&stats.facet=genus&rows=0
export async function getStats(params: StatsParams) {
  const {core, field} = params
  throw 'getStats() is not implemented'
}


export async function queryTaxonID({query}) {
  const q = `?eq(taxon_id,${query})&select(taxon_id,taxon_name,lineage_names)&sort(+taxon_id)`

  const res = await api.get(`/taxonomy${q}`)
  return res.data
}


export function getGenomeCount(taxonID: string) {
  const q = `?eq(taxon_lineage_ids,${taxonID})&select(genome_id)&limit(100001)&${acceptSolr}`
  return api.get(`/genome/${q}`)
    .then(res => res.data.response.numFound)
}


export function getGenomeIDs(taxonID: string) {
  const q = `?eq(taxon_lineage_ids,${taxonID})&select(genome_id)&limit(100001)&${acceptSolr}`
  return api.get(`/genome/${q}`)
    .then(res => res.data.response.docs.map(o => o.genome_id))
}


export function getRepGenomeIDs(taxonID: string) {
  const q = `?eq(taxon_lineage_ids,${taxonID})&or(eq(reference_genome,*))` +
    `&select(genome_id)` +
    `&facet((field,reference_genome),(mincount,1))&json(nl,map)` +
    `&limit(100001)` +
    `&${acceptSolr}`

  return api.get(`/genome/${q}`)
    .then(res => {
      return res.data.response.docs.map(o => o.genome_id)
    })
}


export function queryGenomeNames(query?: string, filterString?: string) {
  let q = '?'
  if (query) {
    q += `or(eq(genome_name,*${query}*),eq(genome_id,*${query}*))&`
  }

  q += (filterString ? filterString : `or(eq(public,true),eq(public,false))`) +
      `&select(genome_id,genome_name,strain,public,owner,reference_genome,taxon_id)` +
      `&limit(20,0)`

  return api.get(`/genome/${q}`, {headers: {}})
    .then(res => res.data)
}



export function getPhyloData({taxonID, genomeID}) {
  if (!taxonID && !genomeID)
    throw 'getPhyloData() expects either a `taxonID` or `genomeID`'

  let id = taxonID ? taxonID : genomeID.split('.')[0]

  return api.get(`/taxonomy/${id}`, {headers: {Accept: 'application/newick+json'} } )
    .then(res => res.data)
}



export function downloadTable(
  core: string,
  taxonID: string,
  type: 'text/tsv' | 'text/csv' | 'application/vnd.openxmlformats',
  primaryKey: string,
  filterStr: string
) {
  const query = (filterStr ? filterStr : '') +
    `eq(taxon_lineage_ids%2C${taxonID})%26sort(%2B${primaryKey})%26limit(25000)`


  const params = new URLSearchParams()
  params.append('rql', query)
  return api.post(`/${core}/?http_accept=${type}&http_download=true`, params)
}



/*
  var form = domConstruct.create('form', {
    style: 'display: none;',
    id: 'downloadForm',
    enctype: 'application/x-www-form-urlencoded',
    name: 'downloadForm',
    method: 'post',
    action: baseUrl
  }, _self.domNode)

  domConstruct.create('input', {
    type: 'hidden',
    value: encodeURIComponent(query),
    name: 'rql'
  }, form)
  form.submit()

    domConstruct.create('input', {
    type: 'hidden',
    value: encodeURIComponent(query),
    name: 'rql'
  }, form)
  form.submit()


*/


/**
 * cache requests for tab views
 */
const cachero = (params, options) => {
  const serialized = JSON.stringify(params)
  if (cache.has(serialized)) {
    // console.log('Using cache for', serialized)
    return cache.get(serialized)
  }

  const prom = Query(params, options)
  cache.set(serialized, prom)

  return prom
}


type ListParams = {
  core: string
  sort?: string
  start?: number
  query?: string
  limit?: number | string
  eq?: object  // todo(nc): define;
  select?: string[]
  solrInfo?: boolean
  filter?: string
}

// {core, query, start = 1, limit = 200, eq, select}
export async function listData(params: ListParams, options = null) {
  const {
    core,
    sort = '-score',
    start = 1,
    query,
    limit,
    eq,   // eq can be used for "in"
    select,
    solrInfo = true,
    filter
  } = params


  if (filter)
    console.log('calling api with free-form rql filter:', filter)

  return cachero({
    core, sort: sort.replace(/ /g, '+') , start, query,
    limit, eq, select, solrInfo,
    filter: filter
  }, options)
}

export function getTaxon(id) {
  return api.get(`/taxonomy/${id}`)
    .then(res => res.data)
}

