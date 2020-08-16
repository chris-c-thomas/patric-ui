
/**
 * Todo: create query builder
*/

import axios from 'axios';
import config from '../config';
const { dataAPI } = config;
import {getToken} from './auth';

import { query as Query} from './data-api-req';

import { metaObjToList } from '../charts/chart-helpers';

const api = axios.create({
  baseURL: dataAPI,
  headers: {
    Authorization: getToken()
  }
})

const cache = new Map()

const solrConfigStr = 'http_content-type=application/solrquery+x-www-form-urlencoded'

// config for when faceting and post requests in rqlquery are needed
const rqlReqConfig =  {
  headers: {
    'Content-Type': 'application/rqlquery+x-www-form-urlencoded',
    Accept: 'application/solr+json'
  }
}


// helper for when Solr query strings are used.
function getSolrConfig({start = null, limit, contentType, data}) {
  let config = {
    headers: {}
  }

  if (start != null && limit) {
    config.headers['Range'] = `items=${start}-${start+limit}`;
  }

  // Note! If putting content-type in the request, the body must
  // have content. This configuration is not currently used,
  // but if it is, config.data should have at least an emtpy hash.
  if (contentType) {
    config.headers['Content-Type'] = contentType;
    config.data = data || {};
  }

  return config;
}


/**
 * Data API helpers
 */

// todo: replace with "Query"
export function listRepresentative({taxonID,  limit=10000}) {
  const q = `?eq(taxon_lineage_ids,${taxonID})&or(eq(reference_genome,*))` +
    `&select(genome_id,reference_genome,genome_name)` +
    `&facet((field,reference_genome),(mincount,1))&json(nl,map)` +
    `&limit(${limit})` +
    `&http_accept=application/solr+json`;

  return api.get(`/genome/${q}`)
    .then(res => {
      let docs = res.data.response.docs
      return docs;
    })
}

// todo: replace with "Query"
export function getAMRCounts({genomeIDs}) {
  console.warn('Note: The AMR Overview Counts still need to be fixed.')
  const kinds = 'Resistant,Susceptible,Intermediate';
  const pivot = 'antibiotic,resistant_phenotype,genome_id';

  const q = //`in(genome_id,(${genomeIDs.join(',')}))` +
  `in(resistant_phenotype,(${kinds}))` +
  `&limit(1)&facet((pivot,(${pivot})),(mincount,1),(limit,-1))` +
  `&json(nl,map)`;

  return api.post(`/genome_amr/`, q, rqlReqConfig)
    .then(res => {
      const pivots = res.data.facet_counts.facet_pivot[pivot];

      // convert nested objects into list of objects
      return pivots.map(drug => {
        const obj = {}
        drug.pivot.forEach(item => {
          obj[item.value] = item.count;
        })
        return {
          drug: drug.value,
          total: drug.count,
          ...obj
        }
      }).sort((a, b) => (a.total < b.total) ? 1 : -1)
    })
}

// todo: replace with "Query"
export function getTaxonOverview({taxonID}) {
  const q = `?eq(taxon_lineage_ids,${taxonID})` +
    `&facet((field,host_name),(field,disease),(field,genome_status),(field,isolation_country),(mincount,1))` +
    `&limit(1)&json(nl,map)` +
    `&http_accept=application/solr+json`;

  return api.get(`/genome/${q}`)
    .then(res => {
      const obj = res.data.facet_counts.facet_fields;

      return {
        host_name: metaObjToList(obj.host_name),
        disease: metaObjToList(obj.disease),
        genome_status: metaObjToList(obj.genome_status),
        isolation_country: metaObjToList(obj.isolation_country)
      }
    })
}

export function getGenomeMeta(genome_id) {
  return Query({eq: {genome_id}})
    .then(data => data[0])
}

// todo: replace with "Query"
export function queryTaxon({query, start = 0, limit = 25}) {
  const q = `?q=((taxon_name:*${query}*)%20OR%20(taxon_name:${query}))%20AND%20` +
    `(taxon_rank:(superkingdom)^7000000%20OR%20taxon_rank:(phylum)^6000000%20OR%20` +
    `taxon_rank:(class)^5000000%20OR%20taxon_rank:(order)^4000000%20OR%20` +
    `taxon_rank:(family)^3000000%20OR%20taxon_rank:(genus)^2000000%20OR%20` +
    `taxon_rank:(species)^1000000%20OR%20taxon_rank:*)` +
    `&fl=taxon_name,taxon_id,taxon_rank,lineage_names&qf=taxon_name&${solrConfigStr}`

  const config = getSolrConfig({start, limit: limit});
  return api.get(`/taxonomy${q}`, config)
    .then(res => {
      return res.data;
    })
}


const parseFacets = (facetList) => {
  const data = []

  let obj = {}
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


export function getFacets({core, taxonID, field, facetQueryStr}) {
  let q
  if (facetQueryStr) {
    q = `?and(eq(taxon_lineage_ids,${taxonID}),${facetQueryStr})`
  } else {
    q = `?eq(taxon_lineage_ids,${taxonID})`
  }

  q += `&limit(1)&facet((field,${field}),(mincount,1))&http_accept=application/solr+json`


    return api.get(`/${core}/${q}`)
      .then(res => parseFacets(res.data.facet_counts.facet_fields[field]))

}


export function queryTaxonID({query}) {
  const q = `?eq(taxon_id,${query})&select(taxon_id,taxon_name,lineage_names)&sort(+taxon_id)`;

  return api.get(`/taxonomy${q}`)
    .then(res => res.data)
}


export function getPhyloData({taxonID}, ) {
  return api.get(`/taxonomy/${taxonID}`, {headers: {Accept: 'application/newick+json'} } )
    .then(res => res.data)
}



/**
 * general purpose solr cached request
 */

const cacheroStr = (strReq) => {
  if (cache.has(strReq)) {
    console.log('Using cache for', strReq)
    return cache.get(strReq)
  }

  const prom = api.get(strReq)
    .then(res => res.data)

  cache.set(strReq, prom)

  return prom
}


const cachero = (params) => {
  const serialized = JSON.stringify(params)
  if (cache.has(serialized)) {
    console.log('Using cache for', serialized)
    return cache.get(serialized)
  }

  const prom = Query(params)
  cache.set(serialized, prom)

  return prom
}


//{core, query, start = 1, limit = 200, eq, select}
export function listData(params) {
  const {
    core = 'genome',
    sort = '-score',
    start = 1,
    query,
    limit,
    eq,
    select,
    solrInfo = true,
    filter // free form rql
  } = params

  console.log('calling api with start:', start)
  return cachero({
    core, sort, start, query,
    limit, eq, select, solrInfo, filter
  })
}

export function getTaxon(id) {
  return cacheroStr(`/taxonomy/${id}`)
}


