import UserApi from '../api/UserApi';
import ActionTypes from '../constants/actionTypes';

export function uploadAvatar(avatar, user_id) {
  return (dispatch) => {
    dispatch(request());
    return UserApi.uploadAvatar(avatar, user_id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.UPLOAD_AVATAR.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.UPLOAD_AVATAR.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.UPLOAD_AVATAR.FAILURE, payload: error };
  }
}

export function uploadPreset(avatar, user_id) {
  return (dispatch) => {
    dispatch(request());
    return UserApi.uploadPreset(avatar, user_id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.UPLOAD_PRESET.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.UPLOAD_PRESET.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.UPLOAD_PRESET.FAILURE, payload: error };
  }
}

export function getAvatar(file_name) {
  return (dispatch) => {
    dispatch(request());
    return UserApi.getAvatar(file_name)
      .then((resp) => resp.blob())
      .then((blobFile) => {
        return dispatch(success(new File([blobFile])));
      })
      .catch((error) => {
        return dispatch(failure(error.reseponse?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_AVATAR.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_AVATAR.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_AVATAR.FAILURE, payload: error };
  }
}
