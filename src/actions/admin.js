import AdminApi from '../api/AdminApi';
import ActionTypes from '../constants/actionTypes';

export function fetchStudents(data) {
  return (dispatch) => {
    dispatch(request());
    return AdminApi.fetchStudents(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.FETCH_STUDENTS.REQUEST, payload: data };
  }
  function success(data) {
    return { type: ActionTypes.FETCH_STUDENTS.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.FETCH_STUDENTS.FAILURE, payload: error };
  }
}

export function getUserById(id) {
  return (dispatch) => {
    dispatch(request());
    return AdminApi.getUserById(id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_USER_BY_ID.REQUEST, payload: id };
  }
  function success(data) {
    return { type: ActionTypes.GET_USER_BY_ID.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_USER_BY_ID.FAILURE, payload: error };
  }
}

export function confirmationReferal(id) {
  return (dispatch) => {
    dispatch(request());
    return AdminApi.confirmationReferal(id)
      .then((resp) => {
        console.log(resp);
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.CONIFIRM_REFERAL.REQUEST, payload: id };
  }
  function success(data) {
    return { type: ActionTypes.CONIFIRM_REFERAL.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.CONIFIRM_REFERAL.FAILURE, payload: error };
  }
}

export function fetchTutors(data = {}) {
  return (dispatch) => {
    dispatch(request());
    return AdminApi.fetchTutors(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.FETCH_TUTORS.REQUEST, payload: data };
  }
  function success(data) {
    return { type: ActionTypes.FETCH_TUTORS.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.FETCH_TUTORS.FAILURE, payload: error };
  }
}

export function fetchTutorRates(data) {
  return (dispatch) => {
    dispatch(request());
    return AdminApi.fetchTutorRate(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.FETCH_TUTOR_RATES.REQUEST, payload: data };
  }
  function success(data) {
    return { type: ActionTypes.FETCH_TUTOR_RATES.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.FETCH_TUTOR_RATES.FAILURE, payload: error };
  }
}

export function updateTutorHourlyRate(data) {
  return (dispatch) => {
    dispatch(request());
    return AdminApi.updateTutorHourlyRate(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return {
      type: ActionTypes.UPDATE_TUTOR_HOURLY_RATE.REQUEST,
      payload: data,
    };
  }
  function success(data) {
    return {
      type: ActionTypes.UPDATE_TUTOR_HOURLY_RATE.SUCCESS,
      payload: data,
    };
  }
  function failure(error) {
    return {
      type: ActionTypes.UPDATE_TUTOR_HOURLY_RATE.FAILURE,
      payload: error,
    };
  }
}
