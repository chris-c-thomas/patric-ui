/**
 * Ex:
 *    node -r esm pathway-test.js
 */

import {query} from '../src/api/data-api-req'

const genomeIDs = [
  '1160233.3',
  '204722.15',
  '29459.45',
  '35802.57',
  '35802.83',
  '35802.75',
  '1408887.3',
  '1198699.3',
  '35802.52',
  '1210448.3',
  '1905695.3'
]


const group = {
  field: 'pathway_id',
  format: 'simple',
  facet: true
}

const facet = {
  field: 'pathway_id',
  mincount: 1
}

const jsonFacet = {
  stat: {
    field: {
      field: 'pathway_id',
      limit: -1,
      facet: {
        genome_count: 'unique(genome_id)',
        gene_count: 'unique(feature_id)',
        ec_count: 'unique(ec_number)',
        genome_ec: 'unique(genome_ec)'
      }
    }
  }
}


function queryGroup(genome_id, pathway_id) {
  return query({
    core: 'pathway',
    solrInfo: true,
    eq: {genome_id, pathway_id, annotation: 'PATRIC'},
    group,
    limit: 25000,
    json: {facet, jsonFacet}
  }).then(res => {
    const {grouped} = res
    console.log('grouped', grouped)
    const {docs, numFound} = grouped['pathway_id'].doclist

    console.log('docs', docs)
    console.log('number of docs', docs.length)
    console.log('number found:', numFound)

    return res
  }).catch(e =>
    console.error(e)
  )
}


function getPathways(genomeID) {
  return query({
    core: 'pathway', solrInfo: true, facet,
    eq: {genome_id: genomeID},
    // select: ['pathway_id'],
    // limit: 25000
  }).then(res => {
    const {facet_counts} = res
    const countList = facet_counts.facet_fields['pathway_id']
    console.log('countList', countList)

    const topPathwayID = countList[0]

    return topPathwayID
  }).catch(e => console.error(e))

}


const genomeID = '35802.52'
getPathways(genomeID).then(pathwayID => {
  console.log(`fetching ngroup for topPathway (${pathwayID})...`)
  queryGroup(genomeID, pathwayID)
})
