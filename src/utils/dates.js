
export const months = [
  'January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

export function toPrettyDate(date, fullVersion) {
  if (!date) return '-'
  const d = new Date(date)

  if (fullVersion)
    return ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear();

  return ((d.getMonth() > 8) ? (d.getMonth() + 1) : ((d.getMonth() + 1))) + '/' + ((d.getDate() > 9) ? d.getDate() : (d.getDate())) + '/' + String(d.getFullYear()).slice(2);
}