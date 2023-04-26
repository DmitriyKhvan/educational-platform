import SubscriptionApi from '../api/SubscriptionApi';
import ActionTypes from '../constants/actionTypes';

export function getSubscriptions(data) {
  return (dispatch) => {
    dispatch(request());
    return SubscriptionApi.getSubscriptions(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(null));
      });
  };

  function request() {
    return { type: ActionTypes.GET_SUBSCRIPTIONS.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_SUBSCRIPTIONS.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_SUBSCRIPTIONS.FAILURE, payload: error };
  }
}

export function createPlan(plan) {
  return (dispatch) => {
    dispatch(request());
    return SubscriptionApi.createPlan(plan)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error?.response?.data?.error?.message));
      });
  };

  function request() {
    return { type: ActionTypes.CREATE_PLAN.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.CREATE_PLAN.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.CREATE_PLAN.FAILURE, payload: error };
  }
}

export function updatePlan(plan) {
  return (dispatch) => {
    dispatch(request());
    return SubscriptionApi.updatePlan(plan)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(null));
      });
  };

  function request() {
    return { type: ActionTypes.UPDATE_PLAN.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.UPDATE_PLAN.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.UPDATE_PLAN.FAILURE, payload: error };
  }
}

export function getPlan(data) {
  return (dispatch) => {
    dispatch(request());
    return SubscriptionApi.getPlan(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(null));
      });
  };

  function request() {
    return { type: ActionTypes.GET_PLAN.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_PLAN.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_PLAN.FAILURE, payload: error };
  }
}

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

export function validateCoupon(data) {
  return (dispatch) => {
    dispatch(request());
    return SubscriptionApi.validateCoupon(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(null));
      });
  };

  function request() {
    return { type: ActionTypes.VALIDATE_COUPON.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.VALIDATE_COUPON.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.VALIDATE_COUPON.FAILURE, payload: error };
  }
}
