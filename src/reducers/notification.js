import ActionTypes from '../constants/actionTypes'

const initialState = {
  list: []
}

export default function notification(state = initialState, action) {
  let { payload } = action
  // Get User By Id
  switch (action.type) {
    case ActionTypes.ADD_NOTIFICATION:
      if (state.list.map(m => m.id).indexOf(payload.id) < 0) {
        return {
          ...state,
          list: [
            { message: payload, read: false, id: payload.id },
            ...state.list
          ]
        }
      }
      return state
    case ActionTypes.READ_NOTIFICATION:
      return {
        ...state,
        list: state.list.map(m => {
          if (m.id === payload) {
            return {
              ...m,
              read: true
            }
          }
          return m
        })
      }
    case ActionTypes.DELETE_ALL_NOTIFICATION:
      return {
        ...state,
        list: []
      }
    default:
      return state
  }
}
