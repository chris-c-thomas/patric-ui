

import axios from 'axios';
import {getRepGenomeIDs} from './data-api'

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

const _getPubs = (ids, max) => {
  return api.get(`esummary.fcgi?id=${ids.join(',')}&db=pubmed&retmax=${max}&retmode=json`)
      .then(res => res.data.result.uids.map(k => res.data.result[k]))
}


export function getPublications(taxonID, max = 5) {
  if (taxonID in [2, 2157, 2759, 10239]) {
    return _getPubs(defaultIDs)
  }

  return getRepGenomeIDs(taxonID).then(ids => {
    return _getPubs(ids, max)
  })
}
