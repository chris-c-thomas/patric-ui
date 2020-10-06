import buildFilterString from'./buildFilterString'


type Action = {
  type: 'SET' | 'UPDATE' | 'RANGE' | 'SELECT_ALL' | 'RESET' | 'URL_CHANGE'
  field?: string
  value: string | {min: string, max: string} | string[]
}

const filterReducer = (state, action: Action) => {
  console.log('******called filterReducer', state, action)

  switch (action.type) {

  case 'SET': {   // useful for url changes?
    const {byCategory, range, filterString} = action.value

    return {
      ...state,
      byCategory,
      range,
      filterString
    }
  }

  case 'UPDATE': {
    const {value, field} = action
    const facets = field in state.byCategory ? state.byCategory[field] : []

    const byCategory = {
      ...state.byCategory,
      [field]: facets.includes(value) ? facets.filter(str => str != value) : [...facets, value]
    }

    return {
      ...state,
      byCategory,
      filterString: buildFilterString(byCategory, state.range)
    }
  }

  case 'RANGE': {
    const {value, field} = action

    const range = {
      [field]: value
    }

    return {
      ...state,
      range,
      filterString: buildFilterString(state.byCategory, range)
    }
  }

  case 'SELECT_ALL': {
    const {value, field} = action

    const byCategory = {
      ...state.byCategory,
      [field]: value
    }

    return {
      ...state,
      byCategory,
      filterString: buildFilterString(byCategory, state.range)
    }
  }

  case 'RESET': {
    const {field} = action

    const byCategory = {
      ...state.byCategory,
      [field]: []
    }

    return {
      ...state,
      byCategory,
      filterString: buildFilterString(byCategory, state.range)
    }
  }

  default:
    return state
  }
}

export default filterReducer