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


// todo: fix dates
const getToday = () => new Date().toISOString().split('T')[0]

/**
 * Log API
 */
export const getHealthReport = ({service = null, date = null}) =>
  api.get(`/results/health/health_${date || getToday()}.txt`)
    .then(res => parseLog(res.data, service))


export function getDailyHealth() {
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
