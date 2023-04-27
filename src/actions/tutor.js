import TutorApi from '../api/TutorApi';
import ActionTypes from '../constants/actionTypes';

export function getTutorInfo(tutor_id) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.getTutorInfo(tutor_id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_TUTOR_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_TUTOR_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_TUTOR_INFO.FAILURE, payload: error };
  }
}

export function getTutorAll() {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.getTutorInfo()
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_TUTOR_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_TUTOR_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_TUTOR_INFO.FAILURE, payload: error };
  }
}

export function getTutorList(from, timezone = null) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.getTutorList(from, timezone)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_TUTOR_LIST.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_TUTOR_LIST.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_TUTOR_LIST.FAILURE, payload: error };
  }
}

export function updateTutorInfo(data) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.updateTutorInfo(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.reseponse?.data));
      });
  };

  function request() {
    return { type: ActionTypes.UPDATE_TUTOR_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.UPDATE_TUTOR_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.UPDATE_TUTOR_INFO.FAILURE, payload: error };
  }
}

export function updateTutorAvailability(availabilities, tutor_id) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.updateTutorAvailability(availabilities, tutor_id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.reseponse?.data));
      });
  };

  function request() {
    return { type: ActionTypes.UPDATE_TUTOR_AVAILABILITIES.REQUEST };
  }
  function success(data) {
    return {
      type: ActionTypes.UPDATE_TUTOR_AVAILABILITIES.SUCCESS,
      payload: data,
    };
  }
  function failure(error) {
    return {
      type: ActionTypes.UPDATE_TUTOR_AVAILABILITIES.FAILURE,
      payload: error,
    };
  }
}

export function updateExceptionDates(exceptionDates, tutor_id) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.updateExceptionDates(exceptionDates, tutor_id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.reseponse?.data));
      });
  };

  function request() {
    return { type: ActionTypes.UPDATE_TUTOR_EXCEPTIONDATES.REQUEST };
  }
  function success(data) {
    return {
      type: ActionTypes.UPDATE_TUTOR_EXCEPTIONDATES.SUCCESS,
      payload: data,
    };
  }
  function failure(error) {
    return {
      type: ActionTypes.UPDATE_TUTOR_EXCEPTIONDATES.FAILURE,
      payload: error,
    };
  }
}

export function getOverallStatus(params = {}) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.getOverallStatus(params)
      .then((res) => dispatch(success(res.data)))
      .catch((error) => dispatch(failure(error.response?.data)));
  };

  function request() {
    return { type: ActionTypes.GET_TUTOR_OVERALL_SUMMARY.REQUEST };
  }
  function success(data) {
    return {
      type: ActionTypes.GET_TUTOR_OVERALL_SUMMARY.SUCCESS,
      payload: data,
    };
  }
  function failure(error) {
    return {
      type: ActionTypes.GET_TUTOR_OVERALL_SUMMARY.FAILURE,
      payload: error,
    };
  }
}

export function getPaymentHistory(params = {}) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.getPaymentHistory(params)
      .then((res) => dispatch(success(res.data)))
      .catch((error) => dispatch(failure(error.response?.data)));
  };

  function request() {
    return { type: ActionTypes.GET_TUTOR_PAYMENT_HISTORY.REQUEST };
  }
  function success(data) {
    return {
      type: ActionTypes.GET_TUTOR_PAYMENT_HISTORY.SUCCESS,
      payload: data,
    };
  }
  function failure(error) {
    return {
      type: ActionTypes.GET_TUTOR_PAYMENT_HISTORY.FAILURE,
      payload: error,
    };
  }
}

export function deleteTutor(id) {
  return (dispatch) => {
    dispatch(request());
    return TutorApi.delete(id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.DELETE_TUTOR.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.DELETE_TUTOR.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.DELETE_TUTOR.FAILURE, payload: error };
  }
}
