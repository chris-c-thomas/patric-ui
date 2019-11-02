
export function sortBy(objs, key, numeric) {
  if (numeric)
    return objs.sort((a, b) => (a[key] < b[key]) ? 1 : -1);

  return objs.sort((a, b) => (a[key] > b[key]) ? 1 : -1);
}