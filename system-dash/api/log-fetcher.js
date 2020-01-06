import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});


const parseLog = (data, service = null) => {
  const rows = data.trim().split('\n');
  const objs = rows.map(row => JSON.parse(row))

  const records = objs.map(({time, tests}) => {

    // filter by service if requested
    if (service) {
      tests = tests.filter(test => test.name == service);
    }

    return {
      time,
      tests,
      status: tests.filter(test => test.status == 'F').length ? 'F' : 'P',
      duration: tests.reduce((total, test) => test.duration + total, 0)
    }
  })

  return records;
}


const getToday = () => new Date().toISOString().split('T')[0]

/**
 * Log API
 */
export function getHealthReport ({service = null, date = null}) {
  date = date || getToday()

  // we'll need to get the day before as well since times are in UTC
  const d = new Date(date)
  const dUTC =  Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()-1,
    d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds())
  const dayBefore = new Date(dUTC).toISOString().split('T')[0]

  const path = `/results/health`
  const [file1, file2] = [`${path}/health_${dayBefore}.txt`, `${path}/health_${date}.txt`]

  return axios.all([api.get(file1), api.get(file2)])
    .then(([prevDay, day]) => {
      const prevDayLog = parseLog(prevDay.data, service)
      const log = parseLog(day.data, service)

      // concat and take the last 24 hours
      const data = [...prevDayLog, ...log].slice(-24*60)
      return data
    })
}


export function getCalendar() {
  return api.get(`/results/health-calendar.txt`)
    .then(res => {
      const data = res.data.trim();
      const rows = data.split('\n')
      let objs = rows.map(row => JSON.parse(row))

      objs = objs.map(obj => {
        const passed = obj.services.map(s => s.passed).reduce((acc, val) => acc + val, 0)
        const failed = obj.services.map(s => s.failed).reduce((acc, val) => acc + val, 0)

        return {
          day: obj.date,
          passed,
          failed,
          value: (failed / (passed + failed)) * 100,
          ...obj
        }
      })

      return objs
    })
}


export function getIndexerHistory() {
  return api.get(`/results/indexer/indexer-status.txt`)
  .then(res => {
    const data = res.data.trim();
    const rows = data.split('\n')
    let objs = rows.map(row => JSON.parse(row))

    objs = objs.map((obj, i) => {
      return {
        value: obj.genomesInQueue,
        ...obj
      }
    })

    return objs
  })
}