

export function getFilterSpec(filters, columns) {
  // get labels, types, etc, from column spec
  filters = filters.map(o => {
    const col = columns.filter(obj => obj.id == o.id)[0]
    return {...col}
  })

  // hide rest of filters
  const filterIDs = filters.map(obj => obj.id)
  filters = [
    ...filters,
    ...columns.filter(obj => !filterIDs.includes(obj.id))
      .map(obj => ({...obj, hide: true}))
  ]

  return filters
}
