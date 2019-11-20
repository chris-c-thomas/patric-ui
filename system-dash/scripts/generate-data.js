
/**
 * Ex:
 *    node -r esm generate-data.js > out.json
 */

import {queryGenomes} from '../../src/api/data-api';

const total = 300000
const limit = 25000
const pages = total / limit

function collectSet(start = 0) {
  console.error('fetching with start:', start)

  return queryGenomes({select: ['genus', 'completion_date', 'collection_year', 'isolation_country'], limit, start, sort: '+completion_date'})
    .then(res => {
      return res
    })
    .catch(e => console.error(e.message))
}


async function collectAllData() {

  let allData = []
  for (const i of Array(pages).keys()) {
    const data = await collectSet(i * limit)
    allData = allData.concat(data)
    console.error('done. fetched', data.length, 'items.')
  }

  console.error('writting JSON...')
  console.log(JSON.stringify(allData))
  console.error('done.')
}

collectAllData()