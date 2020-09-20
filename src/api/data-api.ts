
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

const solrConfigStr = 'http_content-type=application/solrquery+x-www-form-urlencoded'

// config for when faceting and post requests in rqlquery are needed
const postConfig =  {
  headers: {
    'Content-Type': 'application/rqlquery+x-www-form-urlencoded',
    Accept: 'application/solr+json'
  }
}

const acceptSolr = `http_accept=application/solr+json`

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

  return api.post(`/genome_amr/`, q, postConfig)
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
  console.log('genome_id', genome_id)
  return Query({core: 'genome', eq: {genome_id}})
    .then(data => data[0])
}

// todo: replace with "Query"?
export function queryTaxon({query, start = 0, limit = 25}) {
  const q = `?q=((taxon_name:*${query}*)%20OR%20(taxon_name:${query}))%20AND%20` +
    `(taxon_rank:(superkingdom)^7000000%20OR%20taxon_rank:(phylum)^6000000%20OR%20` +
    `taxon_rank:(class)^5000000%20OR%20taxon_rank:(order)^4000000%20OR%20` +
    `taxon_rank:(family)^3000000%20OR%20taxon_rank:(genus)^2000000%20OR%20` +
    `taxon_rank:(species)^1000000%20OR%20taxon_rank:*)` +
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


// todo(nc): refactor
export async function getFacets({core, taxonID, field, facetQueryStr}) {
  let q

  // if faceting the genome core, facet everything below taxon
  if (core == 'genome' && facetQueryStr) {
    q = `?and(eq(taxon_lineage_ids,${taxonID}),${facetQueryStr})`
  } else if (core == 'genome') {
    q = `?eq(taxon_lineage_ids,${taxonID})`

  // otherwise, get reference genomes
  } else if (facetQueryStr) {
    const genomeIDs = await getRepGenomeIDs(taxonID)

    q = `?and(in(genome_id,(${genomeIDs.join(',')})),${facetQueryStr})`
    q += `&limit(1)&facet((field,${field}),(mincount,1))&${acceptSolr}&select(genome_id)`

    const res = await api.get(`/${core}/${q}`)
    return parseFacets(res.data.facet_counts.facet_fields[field])
  } else {
    const genomeIDs = await getRepGenomeIDs(taxonID)

    q = `?and(in(genome_id,(${genomeIDs.join(',')})))`
    q += `&limit(1)&facet((field,${field}),(mincount,1))&${acceptSolr}&select(genome_id)`

    const res = await api.get(`/${core}/${q}`)
    return parseFacets(res.data.facet_counts.facet_fields[field])
  }

  q += `&limit(1)&facet((field,${field}),(mincount,1))&${acceptSolr}`

  const res = await api.get(`/${core}/${q}`)
  return parseFacets(res.data.facet_counts.facet_fields[field])
}


export function queryTaxonID({query}) {
  const q = `?eq(taxon_id,${query})&select(taxon_id,taxon_name,lineage_names)&sort(+taxon_id)`

  return api.get(`/taxonomy${q}`)
    .then(res => res.data)
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


export function queryGenomeNames(query: string) {
  const q = `?or(eq(genome_name,*${query}*),eq(genome_id,*${query}*))&or(eq(public,true),eq(public,false))` +
    `&select(genome_id,genome_name,strain,public,owner,reference_genome,taxon_id)` +
    `&limit(20,0)`

  return api.get(`/genome/${q}`, {headers: {}})
    .then(res => res.data)
}


export function getPhyloData({taxonID}, ) {
  return api.get(`/taxonomy/${taxonID}`, {headers: {Accept: 'application/newick+json'} } )
    .then(res => res.data)
}



/**
 * cache requests for tab views
 */
const cachero = (params, options) => {
  const serialized = JSON.stringify(params)
  if (cache.has(serialized)) {
    console.log('Using cache for', serialized)
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
  eq?: any  // todo(nc): define;
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
    core, sort, start, query,
    limit, eq, select, solrInfo,
    filter: filter // ? filter.replace(/(".*")/g, (match) => encodeURIComponent(match)) : null
  }, options)
}

export function getTaxon(id) {
  return api.get(`/taxonomy/${id}`)
    .then(res => res.data)
}

