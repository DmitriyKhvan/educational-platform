import SubscriptionApi from '../api/SubscriptionApi';
import ActionTypes from '../constants/actionTypes';

export function getPlanStatus(data) {
  return (dispatch) => {
    dispatch(request());
    return SubscriptionApi.getPlanStatus(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(null));
      });
  };

  function request() {
    return { type: ActionTypes.GET_PLAN_STATUS.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_PLAN_STATUS.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_PLAN_STATUS.FAILURE, payload: error };
  }
}