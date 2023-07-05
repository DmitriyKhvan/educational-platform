import StudentApi from '../api/StudentApi';
import ActionTypes from '../constants/actionTypes';

export function setFavourite(data) {
  return (dispatch) => {
    dispatch(request());
    return StudentApi.setFavourite(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };
  function request() {
    return { type: ActionTypes.SET_FAVOURITE.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.SET_FAVOURITE.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.SET_FAVOURITE.FAILURE, payload: error };
  }
}


export function fetchStudentList(params = {}) {
  return (dispatch) => {
    dispatch(request());
    return StudentApi.getStudentList(params)
      .then((resp) => {
        return dispatch(success(resp.data.students));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_STUDENT_LIST.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_STUDENT_LIST.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_STUDENT_LIST.FAILURE, payload: error };
  }
}

export function setReview(data) {
  return (dispatch) => {
    dispatch(request());
    return StudentApi.setReview(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };
  function request() {
    return { type: ActionTypes.SET_REIVEW.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.SET_REIVEW.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.SET_REIVEW.FAILURE, payload: error };
  }
}

export function setTutorAttendance(id, data) {
  return (dispatch) => {
    dispatch(request());
    return StudentApi.setTutorAttendance(id, data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };
  function request() {
    return { type: ActionTypes.SET_TUTOR_ATTENDANCE.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.SET_TUTOR_ATTENDANCE.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.SET_TUTOR_ATTENDANCE.FAILURE, payload: error };
  }
}
