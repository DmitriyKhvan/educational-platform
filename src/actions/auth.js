import AuthApi from '../api/AuthApi';
import ActionTypes from '../constants/actionTypes';

export function login(email, password) {
  return dispatch => {
    dispatch(request())
    return AuthApi.login(email, password)
      .then(resp => {
        console.log(resp)
        localStorage.setItem('access_token', resp.data.access_token)
        return dispatch(success(resp.data))
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.AUTH_LOGIN.REQUEST }
  }
  function success(data) {
    console.log('data from thunk', data)
    return { type: ActionTypes.AUTH_LOGIN.SUCCESS, payload: data }
  }
  function failure(error) {
    return { type: ActionTypes.AUTH_LOGIN.FAILURE, payload: error }
  }
}

export function signup(
  first_name,
  last_name,
  phone_number,
  email,
  password,
  user_role,
  referal_code,
  referalcode
) {
  return dispatch => {
    dispatch(request())
    return AuthApi.signup(
      first_name,
      last_name,
      phone_number,
      email,
      password,
      user_role,
      referal_code,
      referalcode
    )
      .then(resp => {
        return dispatch(success())
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.AUTH_SIGNUP.REQUEST }
  }
  function success() {
    return { type: ActionTypes.AUTH_SIGNUP.SUCCESS }
  }
  function failure(error) {
    return { type: ActionTypes.AUTH_SIGNUP.FAILURE, payload: error }
  }
}

export function emailVerify(token) {
  return dispatch => {
    dispatch(request())
    return AuthApi.verifyEmail(token)
      .then(resp => {
        localStorage.setItem('access_token', token)
        return dispatch(success())
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.AUTH_EMAIL_VERIFY.REQUEST }
  }
  function success() {
    return { type: ActionTypes.AUTH_EMAIL_VERIFY.SUCCESS }
  }
  function failure(error) {
    return { type: ActionTypes.AUTH_EMAIL_VERIFY.FAILURE, payload: error }
  }
}

export function forgotPassword(email) {
  return dispatch => {
    dispatch(request())
    return AuthApi.forgotPassword(email)
      .then(resp => {
        return dispatch(success())
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.AUTH_FORGOT_PASSWORD.REQUEST }
  }
  function success() {
    return { type: ActionTypes.AUTH_FORGOT_PASSWORD.SUCCESS }
  }
  function failure(error) {
    return { type: ActionTypes.AUTH_FORGOT_PASSWORD.FAILURE, payload: error }
  }
}

export function resetPassword(password, token) {
  return dispatch => {
    dispatch(request())
    return AuthApi.resetPassword(password, token)
      .then(resp => {
        return dispatch(success())
      })
      .catch(error => {
        return dispatch(failure(error.response?.data))
      })
  }

  function request() {
    return { type: ActionTypes.AUTH_RESET_PASSWORD.REQUEST }
  }
  function success() {
    return { type: ActionTypes.AUTH_RESET_PASSWORD.SUCCESS }
  }
  function failure(error) {
    return { type: ActionTypes.AUTH_RESET_PASSWORD.FAILURE, payload: error }
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('access_token')
    dispatch(success())
  }

  function success() {
    return { type: ActionTypes.AUTH_LOGOUT.SUCCESS }
  }
}
