import buildFilterString from'./buildFilterString'
import parseQuery from'./parseQuery'


type Action = {
  type: 'UPDATE' | 'RANGE' | 'SELECT_ALL' | 'RESET' | 'URL_CHANGE'
  field?: string
  value: string | {min: string, max: string} | string[]
}

const filterReducer = (state, action: Action) => {
  console.log('******called filterReducer', state, action)

  switch (action.type) {
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

  case 'URL_CHANGE': {
    const {byCategory, range} = parseQuery(action.value)
    const filterString = buildFilterString(byCategory, range)


    return {
      byCategory,
      range,
      filterString
    }
  }


  default:
    return state
  }
}

export default filterReducer