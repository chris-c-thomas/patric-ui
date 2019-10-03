
export function parseTokenStr(str) {
  return str.split('|').reduce((obj, item) => {
    const pair = item.split('='),
          key = pair[0],
          val = pair[1];
    obj[key] = val;
    return obj;
  }, {})
}