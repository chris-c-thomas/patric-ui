/**
 *  Ex:
 *      node -r esm parse-data.js > race.json
 */
import {readFile as rf} from 'fs'
import util from 'util'

const FIELD_OF_INTEREST = process.argv[2] || 'isolation_country'
console.error('field of interest is:', FIELD_OF_INTEREST)

const readFile = util.promisify(rf)

async function parseData(fileName = './out.json') {

  return readFile(fileName, 'utf8').then(data => {
    data = JSON.parse(data);

    let byDate = {}
    data.forEach(item => {
      let {completion_date, collection_year} = item
      let date = completion_date
      let field = item[FIELD_OF_INTEREST]

      field = field == '' ? 'unknown' : field

      if (date in byDate && field in byDate[date]) {
        byDate[date][field] = byDate[date][field] + 1
      } else if (date in byDate) {
        byDate[date][field] = 1
      } else {
        byDate[date] = {[field]: 1}
      }
    })

    return byDate

  }).catch(err => {
    console.log('the error was:', err)
  })
}

// takes object of counts by day (timestamp) and
// returns accumulation counts by day
function getTotalsByDay(data) {
  const totalsByDay = []
  const totals = {}
  Object.keys(data).forEach(date => {
    const totalObj = data[date]
    Object.keys(totalObj).forEach(field => {
      totals[field] = (totals[field] || 0) + totalObj[field]
    })
    totalsByDay.push({date, ...totals})
  })

  return totalsByDay;
}


function getTopNByDay(data, topN = 20) {

  const topByDay = data.map(obj => {
    const top = {}

    // get set of values
    let vals = new Set(Object.keys(obj).filter(k => k !== 'date').map(k => obj[k]))

    // determin lower bound
    let lowerBound;
    if (vals.size >= topN) {
      vals = Array.from(vals);
      const sorted = vals.sort((a, b) => a-b)
      sorted.reverse()
      lowerBound = sorted[topN-1]
    } else {
      lowerBound = 0
    }

    // filter out from lowerBound
    const topList =  Object.keys(obj).filter(k => obj[k] >= lowerBound)
    topList.forEach(field => top[field] = obj[field])

    return {...top, date: obj.date};
  })

  return topByDay
}



async function organizeData() {
  console.error('parsing data...')
  const byDate = await parseData()

  console.error('organizing totals by day...')
  const totalsByDay = getTotalsByDay(byDate)

  console.error('getting top N...')
  const topN = getTopNByDay(totalsByDay)

  console.log(JSON.stringify(topN, null, 4))

  console.error('done.')
}

organizeData();