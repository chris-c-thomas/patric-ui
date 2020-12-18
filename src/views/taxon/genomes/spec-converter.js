const convertSpec = (data) => Object.keys(data).map(key => {
  const {field, label, hidden} = data[key]
  return {
    type: 'text',
    id: field,
    label,
    hide: hidden
  }
})