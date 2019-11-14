import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});


const parseLog = (data, service = null) => {
  let rows = data.trim().split('\n');
  let columns = rows.shift().split('\t');

  // remove time from columns list
  columns.shift();

  const records = rows.map(row => {
    const vals = row.split('\t');

    // parse time, remove it from rows
    const timeStr = vals[0];
    const [s, e] = [timeStr.indexOf('[')+1, timeStr.indexOf(']')];
    const time = vals.shift().slice(s, e);

    let tests = columns.map((name, j) => {
      const result = vals[j];
      return {
        name,
        status: result.split('|')[0],
        duration: Number(result.split('|')[1])
      }
    })

    if (service)
      tests = tests.filter(test => test.name == service);

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
const getToday = () => new Date().toLocaleDateString('sv-SE')

/**
 * Log API
 */
export function getHealthReport(service = null) {
  return api.get(`/results/health_${getToday()}.tsv`)
    .then(res => parseLog(res.data, service))
}

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
