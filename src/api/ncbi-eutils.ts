

import axios from 'axios'
import {getRepGenomeIDs} from './data-api'

const api = axios.create({
  baseURL: 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/'
})


const _getPubs = (ids, max) => {
  return api.get(`esummary.fcgi?id=${ids.join(',')}&db=pubmed&retmax=${max}&retmode=json`)
    .then(res => res.data.result.uids.map(k => res.data.result[k]))
}


export function getPublications(taxonID, max = 5) {
  return getRepGenomeIDs(taxonID).then(ids => {
    return _getPubs(ids, max)
  })
}



// example ids: SRR5121082, ERR3827346, SRX981334
export function validateSRR(id: string) : Promise<any> {
  if (!id.match(/^[a-z]{3}[0-9]+$/i)) {
    throw 'Invalid SRR accession'
  }

  return api.get(`efetch.fcgi?retmax=10&db=sra&id=${id}`, {timeout: 1000})
    .then(res => {
      const xml = new DOMParser().parseFromString(res.data, 'text/xml')

      let title
      try {
        title = xml.querySelector('TITLE').innerHTML
      } catch (e) {
        title = ''
      }

      /*
      xml.querySelectorAll('RUN_SET').forEach((item) => {
        item.forEach((currentValue) => {
          if (id == currentValue.attributes.accession.nodeValue) {
            isrun = true
          }
        })
      })
      */

      return {
        title
      }
    })


  /*
      try {
        title = xml_resp.children[0].children[0].childNodes[3].children[1].childNodes[0].innerHTML
      }
      catch (e) {
        console.log(xml_resp)
        console.error('Could not get title from SRA record.  Error: ' + e)
      }
      try {
        xml_resp.children[0].children[0].childNodes.forEach(function (item) {
          if (item.nodeName == 'RUN_SET') {
            item.childNodes.forEach(function (currentValue) {
              if (id == currentValue.attributes.accession.nodeValue) {
                isrun = true
              }
            })
          }
        })
      }
      catch (e) {
        console.log(xml_resp)
        console.error('Could not get run id from SRA record.  Error: ' + e)
      }
      if (isrun) {
        this.onAddSRRHelper(title)
      } else {
        this.srr_accession.set('disabled', false)
        this.srr_accession_validation_message.innerHTML = ' The accession is not a run id.'
      }
    }),
    lang.hitch(this,
      function (err) {
        var status = err.response.status
        this.srr_accession.set('disabled', false)
        //                console.log(status);
        //                console.log(err);
        if (status >= 400 && status < 500) {
          // NCBI eutils gives error code 400 when the accession does not exist.
          this.srr_accession_validation_message.innerHTML = ' Your input ' + accession + ' is not valid'
        } else if (err.message.startsWith('Timeout exceeded')) {
          this.onAddSRRHelper(title)
          this.srr_accession_validation_message.innerHTML = ' Timeout exceeded.'
        } else {
          throw new Error('Unhandled SRA validation error.')
        }
      })
  )
  */

}
