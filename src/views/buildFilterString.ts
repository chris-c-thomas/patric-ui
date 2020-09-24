

const getFacetFields = (state: object) =>
  Object.keys(state).filter(k => state[k].length > 0)


const getORStr = (state, field) =>
  ('or(' +
    state[field].map(val => `eq(${field},%22${encodeURIComponent(val).replace(/,/g, '%2C')}%22)`)
      .join(',') +
  ')').replace(/,*or\(\),*/g, '')


export default function buildFilterString(state: object) {
  let queryStr

  const fields = getFacetFields(state)

  // case for: eq(field,val)
  if (fields.length == 1 && state[fields[0]].length == 1) {
    const field = fields[0]
    const value = state[field][0]
    queryStr = `eq(${field},%22${encodeURIComponent(value).replace(/,/g, '%2C')}%22)`

  // case for: or(eq(field,val), ..., eq(field_n,val_n))
  } else if (fields.length == 1) {
    const field = fields[0]
    queryStr = getORStr(state, field)

  // case for: and(or(...), ..., or(...))
  } else {
    queryStr =
      ('and(' +
        fields.map(field => getORStr(state, field)).join(',') +
      ')').replace(/,*and\(\),*/g, '')
  }

  return queryStr
}
