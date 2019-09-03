import axios from 'axios';

import config from '../config';
const { dataAPI } = config;


const getOpts =  {}

export function listGenomes({query, start, limit = 200}) {
  let q =
    `?http_accept=application/solr+json` +
    `&eq(taxon_lineage_ids,234)&sort(-score)` +
    `${start ? `&limit(${limit},${start-1})` : `&limit(${limit})`}` +
    `${query ? `&keyword(*${query}*)` : ''}`


  return axios.get(`${dataAPI}/genome/${q}`, getOpts)
    .then(res => {
      let data = res.data.response.docs
      console.log('data', data)
      return res;
    })
}


export function queryTaxon({query}) {
  let q = `?q=((taxon_name:*${query}*)%20OR%20(taxon_name:${query}))%20AND%20` +
    `(taxon_rank:(superkingdom)^7000000%20OR%20taxon_rank:(phylum)^6000000%20OR%20` +
    `taxon_rank:(class)^5000000%20OR%20taxon_rank:(order)^4000000%20OR%20` +
    `taxon_rank:(family)^3000000%20OR%20taxon_rank:(genus)^2000000%20OR%20` +
    `taxon_rank:(species)^1000000%20OR%20taxon_rank:*)&fl=taxon_name,taxon_id,taxon_rank,lineage_names&qf=taxon_name`

  let reqOpts = {headers: { accept: 'application/json', 'content-type': 'application/solrquery+x-www-form-urlencoded' }};
  return axios.get(`${dataAPI}/taxonomy${q}`, reqOpts)
    .then(res => {
      let data = res.data.response.docs
      console.log('taxon data:', data)
      return res;
    })
}

export function queryTaxonID({query}) {
  let q = `?q=((taxon_name:*${query}*)%20OR%20(taxon_name:${query}))%20AND%20` +
    `(taxon_rank:(superkingdom)^7000000%20OR%20taxon_rank:(phylum)^6000000%20OR%20` +
    `taxon_rank:(class)^5000000%20OR%20taxon_rank:(order)^4000000%20OR%20` +
    `taxon_rank:(family)^3000000%20OR%20taxon_rank:(genus)^2000000%20OR%20` +
    `taxon_rank:(species)^1000000%20OR%20taxon_rank:*)&fl=taxon_name,taxon_id,taxon_rank,lineage_names&qf=taxon_name`

  let reqOpts = {headers: { accept: 'application/json', 'content-type': 'application/solrquery+x-www-form-urlencoded' }};
  return axios.get(`${dataAPI}/taxonomy${q}`, reqOpts)
    .then(res => {
      let data = res.data.response.docs
      console.log('taxon data:', data)
      return res;
    })
}