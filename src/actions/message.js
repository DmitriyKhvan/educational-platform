import MessageApi from '../api/MessageApi';
import ActionTypes from '../constants/actionTypes';

export function getMessage(sender, receiver, last_id = -1, limit = 20) {
  return (dispatch) => {
    dispatch(request());
    return MessageApi.getMessage(sender, receiver, last_id, limit)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_MESSAGE_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_MESSAGE_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_MESSAGE_INFO.FAILURE, payload: error };
  }
}
