


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

export function msToTimeStr(milliseconds) {
  if (milliseconds >= 86400000 ) {
    console.error('msToTimeStr: can not compute times over a full day (86400000 ms)')
    return 'N/A'
  }

  let str = new Date(milliseconds).toISOString().slice(11, -1);
  return str
}