import ActionTypes from '../constants/actionTypes';

const initialState = {
  subscriptions: [],
  loading: false,
};

export default function subscription(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.GET_SUBSCRIPTIONS.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.GET_SUBSCRIPTIONS.SUCCESS:
      return {
        ...state,
        loading: false,
        subscriptions: action.payload,
      };
    case ActionTypes.GET_SUBSCRIPTIONS.FAILURE:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
