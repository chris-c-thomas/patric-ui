
export function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes == 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1000, i)) + ' ' + sizes[i]
}

// to date.toDateString(); something like: "Fri Aug 28 2020"
export function toDateTimeStr(dateTime: Date) {
  const date = new Date(dateTime)
  return date.toDateString()
}

// to HH:MM
export function timeToHumanTime(dateTime) {
  return  new Date(dateTime).toLocaleTimeString([], { hour: 'numeric', minute: 'numeric', hour12: true })
}

// to MM/DD/YYYY, HH:MM <AM/PM>
export function isoToHumanDateTime(dateTime: Date) {
  return new Date(dateTime).toLocaleTimeString([], {
    month: 'numeric', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: true
  })
}

// milliseconds to HH:MM:SS.MMM
export function msToTimeStr(ms) {
  if (ms >= 1440000 ) {
    console.error('msToTimeStr: can not compute times over 60 mins (1440000 ms)')
    return 'N/A'
  }

  let str = new Date(ms).toISOString().slice(14, -1)
  return str
}


const prettyTimeParts = ['h', 'm', 's']

//  milliseconds to <hours>h <minutes>m <seconds>s.<milliseconds>
export function prettyTime(ms: number, includeMS: boolean = true) {
  const hhmmss = msToTimeStr(ms)
  const parts = hhmmss.split(':')
  const seconds = parts.pop()
  const [secs, milliSecs] = seconds.split('.')


  const strs = []
  const l = parts.length
  for (let i = 0; i < l; i++) {
    const val = parseInt(parts[i])
    if (!val) continue

    strs.push(val + prettyTimeParts[i])
  }

  return `${strs.join(' ')} ${parseInt(secs)}${(includeMS ? `.${milliSecs}` : '')}s`
}


