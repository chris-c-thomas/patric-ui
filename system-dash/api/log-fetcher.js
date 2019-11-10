import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});


const parseLog = (data) => {
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

    const tests = columns.map((name, j) => {
      const result = vals[j];
      return {
        name,
        status: result.split('|')[0],
        duration: Number(result.split('|')[1])
      }
    })

    return {
      time,
      tests,
      status: tests.filter(test => test.status == 'F').length ? 'F' : 'P',
      duration: tests.reduce((total, test) => test.duration + total, 0)
    }
  })

  return records;
}

/**
 * Log API
 */
export function getHealthSummary() {
  return api.get(`/results/health.tsv`)
    .then(res => parseLog(res.data))
}

