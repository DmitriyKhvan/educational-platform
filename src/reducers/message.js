import ActionTypes from '../constants/actionTypes';

const initialState = {
  loading: false,
  data: [],
};

export default function users(state = initialState, action) {
  let { payload } = action;

  switch (action.type) {
    case ActionTypes.GET_MESSAGE_INFO.REQUEST:
      return {
        ...state,
        loading: true,
        data: [],
      };
    case ActionTypes.GET_MESSAGE_INFO.SUCCESS:
      return {
        ...state,
        data: payload.messages,
        loading: false,
      };
    case ActionTypes.GET_MESSAGE_INFO.FAILURE:
      return {
        ...state,
        loading: false,
        data: [],
      };

    default:
      return state;
  }
}
