
// handles selection of rows (to include shift/ctrl click)
const selectedReducer = (state, action) => {
  if (action.type == 'SHIFT_SET' && state.lastSelected) {
    return {
      ...state,
      lastSelected: action.id,
      ids: [action.id],
      objs: [action.obj]
    }
  } else if (action.type == 'CTRL_SET' && state.lastSelected) {
    return {
      ...state,
      lastSelected: action.id,
      ids: [action.id],
      objs: [action.obj]
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