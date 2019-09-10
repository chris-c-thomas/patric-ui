import axios from 'axios';

import config from '../config';
const { dataAPI } = config;

const api = axios.create({
  baseURL: dataAPI
});

const solrConfigStr = 'http_content-type=application/solrquery+x-www-form-urlencoded'

// helper for when Solr query strings are used.
function getSolrConfig({start = null, limit, contentType}) {
  let config = {
    headers: {}
  }

  if (start != null && limit) {
    config.headers['Range'] = `items=${start}-${start+limit}`;
  }

  // If putting content-type in the request, the body must
  // have content. This configuration is not currently
  if (contentType) {
    config.headers['Content-Type'] = contentType;
    config.data = {};
  }

  return config;
}


export function listGenomes({query, start, limit = 200}) {
  const q =
    `?http_accept=application/solr+json` +
    `&eq(taxon_lineage_ids,234)&sort(-score)` +
    `${start ? `&limit(${limit},${start-1})` : `&limit(${limit})`}` +
    `${query ? `&keyword(*${query}*)` : ''}`


  return api.get(`/genome/${q}`, getOpts)
    .then(res => {
      let data = res.data.response.docs
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