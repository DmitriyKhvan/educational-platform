import ActionTypes from '../constants/actionTypes'

const initialState = {
  loading: false,
  students: [],
  tutors: [],
  user: null,
  rates: [],
  count1: 0,
  count2: 0
}

export default function admin(state = initialState, action) {
  let { payload } = action
  // Get User By Id
  switch (action.type) {
    case ActionTypes.GET_USER_BY_ID.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.GET_USER_BY_ID.SUCCESS:
      return {
        ...state,
        user: payload.user,
        loading: false
      }
    case ActionTypes.GET_USER_BY_ID.FAILURE:
      return {
        ...state,
        loading: false
      }

    // Fetch Student List
    case ActionTypes.FETCH_STUDENTS.REQUEST:
      return {
        ...state,
        students: !payload.offset ? [] : state.students,
        count1: state.count1 + 1,
        loading: true
      }
    case ActionTypes.FETCH_STUDENTS.SUCCESS:
      let student_ids = state.students.map(s => s.id)
      let students =
        state.count1 > 1
          ? []
          : [
              ...state.students,
              ...payload.students.filter(s => !student_ids.includes(s.id))
            ]
      return {
        ...state,
        students,
        count1: state.count1 - 1,
        loading: false
      }
    case ActionTypes.FETCH_STUDENTS.FAILURE:
      return {
        ...state,
        count1: state.count1 - 1,
        loading: false
      }

    // Fetch Tutor List
    case ActionTypes.FETCH_TUTORS.REQUEST:
      return {
        ...state,
        tutors: !payload.offset ? [] : state.tutors,
        count2: state.count2 + 1,
        loading: true
      }
    case ActionTypes.FETCH_TUTORS.SUCCESS:
      let tutor_ids = state.tutors.map(t => t.id)
      let tutors =
        state.count2 > 1
          ? []
          : [
              ...state.tutors,
              ...payload.tutors.filter(t => !tutor_ids.includes(t.id))
            ]
      return {
        ...state,
        tutors,
        count2: state.count2 - 1,
        loading: false
      }
    case ActionTypes.FETCH_TUTORS.FAILURE:
      return {
        ...state,
        count2: state.count2 - 1,
        loading: false
      }

    // Fetch Tutor List
    case ActionTypes.FETCH_TUTOR_RATES.REQUEST:
      return {
        ...state,
        rates: [],
        loading: true
      }
    case ActionTypes.FETCH_TUTOR_RATES.SUCCESS:
      return {
        ...state,
        rates: payload.rates,
        loading: false
      }
    case ActionTypes.FETCH_TUTOR_RATES.FAILURE:
      return {
        ...state,
        loading: false
      }

    case ActionTypes.UPDATE_TUTOR_HOURLY_RATE.REQUEST:
      return {
        ...state,
        rates: [],
        loading: true
      }
    case ActionTypes.UPDATE_TUTOR_HOURLY_RATE.SUCCESS:
      return {
        ...state,
        rates: payload.rates,
        loading: false
      }
    case ActionTypes.UPDATE_TUTOR_HOURLY_RATE.FAILURE:
      return {
        ...state,
        loading: false
      }

    default:
      return state
  }
}
