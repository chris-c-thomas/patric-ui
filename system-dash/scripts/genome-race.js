


import {queryGenomes} from '../../src/api/data-api';

function collectData() {
  queryGenomes({select: ['genus', 'completion_date']})
    .then(res => {
      console.log(res)
    }).catch(e => console.error(e.message))
}


collectData()

