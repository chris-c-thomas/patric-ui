
type RangeFilters = {
  [field: string]: Range
}

type Range = {
  min?: string | null
  max?: string | null
}


const getFacetFields = (state: object) =>
  Object.keys(state).filter(k => state[k].length > 0)


const getORStr = (state, field) =>
  ('or(' +
    state[field].map(val => `eq(${field},%22${encodeURIComponent(val).replace(/,/g, '%2C')}%22)`)
      .join(',') +
  ')').replace(/,*or\(\),*/g, '')


const getRangeStr = (range: RangeFilters) => {
  let q = ''
  for (let [field, val] of Object.entries(range)) {
    const {min, max} = val
    if (min.length && !max.length)
      q += `${q.length ? ',' : ''}gt(${field},%22${min}%22)`
    else if (!min.length && max.length)
      q += `${q.length ? ',' : ''}lt(${field},%22${max}%22)`
    else if (min.length && max.length)
      q += `${q.length ? ',' : ''}between(${field},%22${min}%22,%22${max}%22)`
  }

  return q
}


export default function buildFilterString(state: object, range?: RangeFilters) {
  let queryStr

  const fields = getFacetFields(state)

  const rangeStr = getRangeStr(range)

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
        (rangeStr.length ? rangeStr : '') +
      ')').replace(/,*and\(\),*/g, '')
  }

  // handle remaining range range cases
  if (fields.length == 1 && rangeStr.length) {
    queryStr = `and(${queryStr},${rangeStr})`
  }


  return queryStr
}
