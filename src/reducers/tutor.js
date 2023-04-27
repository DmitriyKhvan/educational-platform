import ActionTypes from '../constants/actionTypes';

const initialState = {
  loading: false,
  info: null,
  list: [],
  appointment: [],
  exceptions: [],
  status: {
    overallStatus: false,
    paymentHistory: [],
  },
};

export default function tutor(state = initialState, action) {
  let { payload } = action;

  switch (action.type) {
    /* tutor info */
    case ActionTypes.GET_TUTOR_INFO.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_TUTOR_INFO.SUCCESS:
      return {
        ...state,
        info: payload.tutor,
        loading: false,
      };
    case ActionTypes.GET_TUTOR_INFO.FAILURE:
      return {
        ...state,
        loading: false,
      };
    /* tutor list */
    case ActionTypes.GET_TUTOR_LIST.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_TUTOR_LIST.SUCCESS:
      return {
        ...state,
        list: payload.tutors,
        loading: false,
      };
    case ActionTypes.GET_TUTOR_LIST.FAILURE:
      return {
        ...state,
        loading: false,
      };
    /* update tutor info */
    case ActionTypes.UPDATE_TUTOR_INFO.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.UPDATE_TUTOR_INFO.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.UPDATE_TUTOR_INFO.FAILURE:
      return {
        ...state,
        loading: false,
      };
    /* update tutor availabilities */
    case ActionTypes.UPDATE_TUTOR_AVAILABILITIES.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.UPDATE_TUTOR_AVAILABILITIES.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.UPDATE_TUTOR_AVAILABILITIES.FAILURE:
      return {
        ...state,
        loading: false,
      };

    /* Get Tutor Payment Status */
    case ActionTypes.GET_TUTOR_OVERALL_SUMMARY.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_TUTOR_OVERALL_SUMMARY.SUCCESS:
      return {
        ...state,
        loading: false,
        status: {
          ...state.status,
          overallStatus: payload,
        },
      };
    case ActionTypes.GET_TUTOR_OVERALL_SUMMARY.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case ActionTypes.GET_TUTOR_PAYMENT_HISTORY.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_TUTOR_PAYMENT_HISTORY.SUCCESS:
      return {
        ...state,
        loading: false,
        status: {
          ...state.status,
          paymentHistory: payload,
        },
      };
    case ActionTypes.GET_TUTOR_PAYMENT_HISTORY.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case ActionTypes.DELETE_TUTOR.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case ActionTypes.DELETE_TUTOR.SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case ActionTypes.DELETE_TUTOR.FAILURE:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
}
