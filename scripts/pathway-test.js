/**
 * Ex:
 *    node -r esm pathway-test.js
 */

import {query} from '../src/api/query-data-api';

const genome_id = [
  "1160233.3",
  "204722.15",
  "29459.45",
  "35802.57",
  "35802.83",
  "35802.75",
  "1408887.3",
  "1198699.3",
  "35802.52",
  "1210448.3",
  "1905695.3"
]

const id = 'pathway_id'

const group = {
  field: id,
  format: 'simple',
  facet: true
}

query({core: 'pathway', solrInfo: true, eq: {genome_id, annotation: 'PATRIC'}, group})
  .then(res => {
    const {grouped} = res
    const {docs, numFound} = grouped[id].doclist

    console.log('docs', docs)
    console.log('number of docs', docs.length)
    console.log('number found:', numFound)

    return res
  })
  .catch(e =>
    console.error(e.message)
  )