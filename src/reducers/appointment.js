import ActionTypes from '../constants/actionTypes'

const initialState = {
  list: [],
  loading: false
}

export default function appointment(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_APPOINTMENT_INFO.REQUEST:
      return {
        ...state,
        list: [],
        loading: true
      }
    case ActionTypes.GET_APPOINTMENT_INFO.SUCCESS:
      return {
        ...state,
        loading: false,
        list: action.payload.filter(apt => apt.students.length > 0)
      }
    case ActionTypes.GET_APPOINTMENT_INFO.FAILURE:
      return {
        ...state,
        list: false
      }

    case ActionTypes.CANCEL_APPOINTMENT_INFO.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.CANCEL_APPOINTMENT_INFO.SUCCESS:
      return {
        ...state,
        loading: false
      }
    case ActionTypes.CANCEL_APPOINTMENT_INFO.FAILURE:
      return {
        ...state,
        loading: false
      }

    case ActionTypes.UPDATE_APPOINTMENT_INFO.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.UPDATE_APPOINTMENT_INFO.SUCCESS:
      return {
        ...state,
        loading: false
      }
    case ActionTypes.UPDATE_APPOINTMENT_INFO.FAILURE:
      return {
        ...state,
        loading: false
      }

    default:
      return state
  }
}
