

export function metaObjToList(metaObj, topN = 4) {
  return Object.keys(metaObj).map(key => ({
    id: key,
    label: key,
    value: metaObj[key]
  })).sort((a, b) => (a.value < b.value) ? 1 : -1)
}
