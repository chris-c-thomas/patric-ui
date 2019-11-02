
/**
 * Todo: create query builder
*/

import axios from 'axios';

import config from '../config';
const { dataAPI } = config;

import metaObjToList from '../charts/chart-helpers';

const api = axios.create({
  baseURL: dataAPI
});

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
  // have content. This configuration is not currently used.
  if (contentType) {
    config.headers['Content-Type'] = contentType;
    config.data = data || {};
  }

  return config;
}


/**
 * Data API helpers
 */
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


export function getOverviewMeta({taxonID}) {
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


export function listGenomes({query, start, limit = 200}) {
  const q  = `?http_accept=application/solr+json` +
    `&eq(taxon_lineage_ids,234)&sort(-score)` +
    `${start ? `&limit(${limit},${start-1})` : `&limit(${limit})`}` +
    `${query ? `&keyword(*${query}*)` : ''}`

  return api.get(`/genome/${q}`)
    .then(res => {
      return res;
    })
}


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


export function queryTaxonID({query}) {
  const q = `?eq(taxon_id,${query})&select(taxon_id,taxon_name,lineage_names)&sort(+taxon_id)`;

  return api.get(`/taxonomy${q}`)
    .then(res => res.data)
}