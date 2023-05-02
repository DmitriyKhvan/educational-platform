import CancelAppointmentApi from '../api/CancelAppointmentApi';
import ActionTypes from '../constants/actionTypes';

export function createCancellation() {
  return (dispatch) => {
    dispatch(request());
  };

  function request() {
    return { type: ActionTypes.CREATE_CANCELLATION.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.CREATE_CANCELLATION.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.CREATE_CANCELLATION.FAILURE, payload: error };
  }
}
