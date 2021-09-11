import ActionTypes from '../constants/actionTypes'

const initialState = {
  loading: false,
  student_info: {},
  connectors: [],
  subscription: null,
  planStatus: [],
  favoriteTutors: [],
  list: [],
  error: null
}

export default function student(state = initialState, action) {
  let { payload } = action

  switch (action.type) {
    case ActionTypes.GET_STUDENT_INFO.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.GET_STUDENT_INFO.SUCCESS:
      return {
        ...state,
        student_info: payload.student,
        loading: false
      }
    case ActionTypes.GET_STUDENT_INFO.FAILURE:
      return {
        ...state,
        loading: false
      }

    case ActionTypes.UPDATE_STUDENT_PROFILE.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.UPDATE_STUDENT_PROFILE.SUCCESS:
      return {
        ...state,
        student_info: payload.student,
        loading: false
      }
    case ActionTypes.UPDATE_STUDENT_PROFILE.FAILURE:
      return {
        ...state,
        loading: false
      }

    case ActionTypes.CREATE_PLAN.REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      }
    case ActionTypes.CREATE_PLAN.SUCCESS:
      return {
        ...state,
        subscription: payload.subscription || null,
        loading: false,
        error: null
      }
    case ActionTypes.CREATE_PLAN.FAILURE:
      return {
        ...state,
        error: payload,
        loading: false
      }

    case ActionTypes.UPDATE_PLAN.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.UPDATE_PLAN.SUCCESS:
      return {
        ...state,
        subscription: payload.subscriptions || null,
        loading: false
      }
    case ActionTypes.UPDATE_PLAN.FAILURE:
      return {
        ...state,
        loading: false
      }

    case ActionTypes.GET_PLAN.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.GET_PLAN.SUCCESS:
      return {
        ...state,
        subscription: payload.subscriptions || null,
        loading: false
      }
    case ActionTypes.GET_PLAN.FAILURE:
      return {
        ...state,
        loading: false
      }

    case ActionTypes.GET_PLAN_STATUS.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.GET_PLAN_STATUS.SUCCESS:
      return {
        ...state,
        planStatus: payload.results || [],
        loading: false
      }
    case ActionTypes.GET_PLAN_STATUS.FAILURE:
      return {
        ...state,
        loading: false
      }

    // Fetch Favorite Tutor List
    case ActionTypes.FETCH_FAVORITE_TUTORS.REQUEST:
      return {
        ...state,
        loading: true
      }

    case ActionTypes.FETCH_FAVORITE_TUTORS.SUCCESS:
      return {
        ...state,
        favoriteTutors: payload.tutors,
        loading: false
      }

    case ActionTypes.FETCH_FAVORITE_TUTORS.FAILURE:
      return {
        ...state,
        loading: false
      }

    // Fetch Student List
    case ActionTypes.GET_STUDENT_LIST.REQUEST:
      return {
        ...state,
        loading: true
      }

    case ActionTypes.GET_STUDENT_LIST.SUCCESS:
      return {
        ...state,
        list: payload,
        loading: false
      }

    case ActionTypes.GET_STUDENT_LIST.FAILURE:
      return {
        ...state,
        loading: false
      }

    default:
      return state
  }
}
