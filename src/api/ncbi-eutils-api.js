

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
});

// Todo: note: not entirely sure about these?
const defaultIDs = [
  31640646,31635062,31631948,31631463,31629291,31621824,
  31618795,31616437,31605592,31603950,31602051,31602050,
  31600543,31599545,31594144,31594142,31593764,31589475,
  31588498,31587689
]

export function getPubSummary({ids, max = 5} = {}) {
  return api.get(`esummary.fcgi?id=${ids || defaultIDs.join(',')}&retmax=${max}&retmode=json&db=pubmed`)
    .then(res => {
      return res.data.result.uids.map(k => res.data.result[k]);
    })
}

export function pubSearch(term) {
  return api.get(`esearch.fcgi?term=${term}&retmode=jsonu&usehistory=y&db=pubmed`)
    .then(res => res.data.result.uids.map(k => res.data.result[k]))
}
