
// handles selection of rows (to include shift/ctrl click)
const selectedReducer = (state, action) => {
  console.log('action', action)

  if (action.type == 'CLEAR') {
    return {
      lastSelected: [],
      ids: [],
      objs: []
    }
  } else if (action.type == 'SHIFT_SET' && state.lastSelected) {
    const {lastSelected} = state

    let newObjs
    if (action.id < lastSelected)
      newObjs = action.rows.filter(({rowID}) => rowID >= action.id && rowID <= lastSelected )
    else if (action.id > lastSelected)
      newObjs = action.rows.filter(({rowID}) => rowID >= lastSelected && rowID <= action.id)

    return {
      ...state,
      lastSelected: action.id,
      ids: newObjs.map(o => o.rowID),
      objs: newObjs
    }
  } else if (action.type == 'CTRL_SET') {
    return {
      ...state,
      lastSelected: action.id,
      ids: [...state.ids, action.id],
      objs: [...state.objs, action.obj]
    }
  } else if (action.type == 'SET') {
    return {
      ...state,
      lastSelected: action.id,
      ids: [action.id],
      objs: [action.obj]
    }
  } else {
    throw `selected object reducer: theres no action for '${action.type}`
  }
}

export default selectedReducer