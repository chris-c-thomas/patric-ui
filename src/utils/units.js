


export function bytesToSize(bytes) {
  let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

export function toDateTimeStr(dateTime) {
  let date = new Date(dateTime);
  return date.toDateString();
}

export function timeToHumanTime(dateTime) {
  return  new Date(dateTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}

// milliseconds to HH:MM:SS.MMM
export function msToTimeStr(ms) {
  if (ms >= 86400000 ) {
    console.error('msToTimeStr: can not compute times over a full day (86400000 ms)')
    return 'N/A'
  }

  let str = new Date(ms).toISOString().slice(11, -1);
  return str
}

const prettyTimeParts = ['h', 'm', 's']

export function prettyTime(ms, includeMS = false) {
  const hhmmss = msToTimeStr(ms)
  const parts = hhmmss.split(':')
  const seconds = parts.pop()
  const [secs, milliSecs] = seconds.split('.')


  const strs = []
  const l = parts.length
  for (let i = 0; i < l; i++) {
    const val = parseInt(parts[i])
    if (!val) continue;

    strs.push(val + prettyTimeParts[i])
  }

  return `${strs.join(' ')} ${parseInt(secs)}${(includeMS ? `.${milliSecs}` : '')}s`
}
