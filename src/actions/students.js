import StudentApi from '../api/StudentApi'
import AdminApi from '../api/AdminApi'
import ActionTypes from '../constants/actionTypes'

export function getStudent(student_id) {
  return dispatch => {
    dispatch(request())
    return StudentApi.getStudent(student_id)
      .then(resp => {
        return dispatch(success(resp.data))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.GET_STUDENT_INFO.REQUEST }
  }
  function success(data) {
    return { type: ActionTypes.GET_STUDENT_INFO.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.GET_STUDENT_INFO.FAILURE, payload: error }
  }
}

export function updateStudent(data) {
  return dispatch => {
    dispatch(request())
    return StudentApi.updateStudent(data)
      .then(resp => {
        return dispatch(success(resp.data))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.UPDATE_STUDENT_PROFILE.REQUEST }
  }
  function success(data) {
    return { type: ActionTypes.UPDATE_STUDENT_PROFILE.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.UPDATE_STUDENT_PROFILE.FAILURE, payload: error }
  }
}

export function setFavourite(data) {
  return dispatch => {
    dispatch(request())
    return StudentApi.setFavourite(data)
      .then(resp => {
        return dispatch(success(resp.data))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }
  function request() {
    return { type: ActionTypes.SET_FAVOURITE.REQUEST }
  }
  function success(data) {
    return { type: ActionTypes.SET_FAVOURITE.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.SET_FAVOURITE.FAILURE, payload: error }
  }
}

export function fetchFavoriteTutors(data = {}) {
  data.favorite = true

  return dispatch => {
    dispatch(request())
    return AdminApi.fetchTutors(data)
      .then(resp => {
        return dispatch(success(resp.data))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.FETCH_FAVORITE_TUTORS.REQUEST, payload: data }
  }
  function success(data) {
    return { type: ActionTypes.FETCH_FAVORITE_TUTORS.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.FETCH_FAVORITE_TUTORS.FAILURE, payload: error }
  }
}

export function fetchStudentList(params = {}) {
  return dispatch => {
    dispatch(request())
    return StudentApi.getStudentList(params)
      .then(resp => {
        return dispatch(success(resp.data.students))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.GET_STUDENT_LIST.REQUEST }
  }
  function success(data) {
    return { type: ActionTypes.GET_STUDENT_LIST.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.GET_STUDENT_LIST.FAILURE, payload: error }
  }
}

export function setReview(data) {
  return dispatch => {
    dispatch(request())
    return StudentApi.setReview(data)
      .then(resp => {
        return dispatch(success(resp.data))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }
  function request() {
    return { type: ActionTypes.SET_REIVEW.REQUEST }
  }
  function success(data) {
    return { type: ActionTypes.SET_REIVEW.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.SET_REIVEW.FAILURE, payload: error }
  }
}

export function setTutorAttendance(id, data) {
  return dispatch => {
    dispatch(request())
    return StudentApi.setTutorAttendance(id, data)
      .then(resp => {
        return dispatch(success(resp.data))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }
  function request() {
    return { type: ActionTypes.SET_TUTOR_ATTENDANCE.REQUEST }
  }
  function success(data) {
    return { type: ActionTypes.SET_TUTOR_ATTENDANCE.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.SET_TUTOR_ATTENDANCE.FAILURE, payload: error }
  }
}
