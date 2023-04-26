import AppointmentApi from '../api/AppointmentApi';
import ActionTypes from '../constants/actionTypes';

export function createLessonExist(data) {
  return (dispatch) => {
    dispatch(request());
    return AppointmentApi.createLessonExist(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.CREATE_LESSON_EXIST.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.CREATE_LESSON_EXIST.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.CREATE_LESSON_EXIST.FAILURE, payload: error };
  }
}

export function getAppointments(params = {}) {
  return (dispatch) => {
    dispatch(request());
    return AppointmentApi.getAppointments(params)
      .then((resp) => {
        return dispatch(success(resp.data.groups));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.GET_APPOINTMENT_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.GET_APPOINTMENT_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return { type: ActionTypes.GET_APPOINTMENT_INFO.FAILURE, payload: error };
  }
}

export function createAppointment(data) {
  return (dispatch) => {
    dispatch(request());
    return AppointmentApi.createAppointment(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.CREATE_APPOINTMENT_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.CREATE_APPOINTMENT_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return {
      type: ActionTypes.CREATE_APPOINTMENT_INFO.FAILURE,
      payload: error,
    };
  }
}

export function cancelAppointment(id) {
  return async (dispatch) => {
    dispatch(request());
    return AppointmentApi.cancelAppointment(id)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.CANCEL_APPOINTMENT_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.CANCEL_APPOINTMENT_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return {
      type: ActionTypes.CANCEL_APPOINTMENT_INFO.FAILURE,
      payload: error,
    };
  }
}

export function updateAppointment(id, data) {
  return (dispatch) => {
    dispatch(request());
    return AppointmentApi.updateAppointment(id, data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.UPDATE_APPOINTMENT_INFO.REQUEST };
  }
  function success(data) {
    return { type: ActionTypes.UPDATE_APPOINTMENT_INFO.SUCCESS, payload: data };
  }
  function failure(error) {
    return {
      type: ActionTypes.UPDATE_APPOINTMENT_INFO.FAILURE,
      payload: error,
    };
  }
}

export function approveAppointment(data) {
  return (dispatch) => {
    dispatch(request());
    return AppointmentApi.approveAppointment(data)
      .then((resp) => {
        return dispatch(success(resp.data));
      })
      .catch((error) => {
        return dispatch(failure(error.response?.data));
      });
  };

  function request() {
    return { type: ActionTypes.APPROVE_APPOINTMENT_INFO.REQUEST };
  }
  function success(data) {
    return {
      type: ActionTypes.APPROVE_APPOINTMENT_INFO.SUCCESS,
      payload: data,
    };
  }
  function failure(error) {
    return {
      type: ActionTypes.APPROVE_APPOINTMENT_INFO.FAILURE,
      payload: error,
    };
  }
}
