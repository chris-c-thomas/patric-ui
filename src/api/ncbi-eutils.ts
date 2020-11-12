

import axios from 'axios'
import {getRepGenomeIDs} from './data-api'

const api = axios.create({
  baseURL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
})


const _getPubs = (ids: number[], max: number) => {
  return api.get(`esummary.fcgi?id=${ids.join(',')}&db=pubmed&retmax=${max}&retmode=json`)
    .then(res => res.data.result.uids.map(k => res.data.result[k]))
}


export function getPublications(taxonID: string, max: number = 5) {
  return getRepGenomeIDs(taxonID).then(ids => {
    return _getPubs(ids, max)
  })
}


// example ids:
//    valid ids:
//        SRR5121082, ERR3827346 SRR5660159 (id that doesn't have title)
//    bad id:
//        SRX981334
export async function validateSRR(id: string) : Promise<{isValid: boolean, title: string}>  {
  if (!id.match(/^[a-z]{3}[0-9]+$/i)) {
    return {isValid: false, title: ''}
  }

  const res = await api.get(`efetch.fcgi?retmax=10&db=sra&id=${id}`, {timeout: 10000})

  const xml = new DOMParser().parseFromString(res.data, 'text/xml')

  let title
  try {
    title = xml.querySelector('TITLE').innerHTML
  } catch (e) {
    title = ''
  }

  let isValid = false
  xml.querySelectorAll('RUN_SET').forEach((item) => {
    item.childNodes.forEach((node) => {
      if (id == node['attributes'].accession.nodeValue) {
        isValid = true
      }
    })
  })

  return {isValid, title}
}
