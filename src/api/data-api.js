import axios from 'axios';

import config from '../config';
const { dataAPI } = config;


const getOpts =  {
  headers: {'Cache-Control': 'only-if-cached'}
}

export function listGenomes({query, start, limit = 200}) {
  let q =
    `?http_accept=application/solr+json` +
    `&eq(taxon_lineage_ids,234)&sort(-score)` +
    `${start ? `&limit(${limit},${start-1})` : `&limit(${limit})`}` +
    `${query ? `&keyword(*${query}*)` : ''}`


  return axios.get(`${dataAPI}/genome/${q}`, getOpts)
    .then((res) => {
      let data = res.data.response.docs
      console.log('data', data)
      return res;
    })
}
