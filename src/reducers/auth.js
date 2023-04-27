import ActionTypes from '../constants/actionTypes';

let access_token = localStorage.getItem('access_token');

const initialState = access_token
  ? {
      authenticated: true,
      access_token: access_token,
      loading: false,
      email_verified: true,
      error: '',
    }
  : {
      authenticated: false,
      access_token: '',
      email_verified: false,
      loading: false,
      error: '',
    };

export default function auth(state = initialState, action) {
  let { payload } = action;
  switch (action.type) {
    case ActionTypes.AUTH_LOGIN.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.AUTH_LOGIN.SUCCESS:
      return {
        ...state,
        access_token: payload.access_token,
        authenticated: true,
        error: '',
        loading: false,
      };
    case ActionTypes.AUTH_LOGIN.FAILURE:
      localStorage.removeItem('access_token');
      return {
        ...state,
        authenticated: false,
        access_token: '',
        error: payload?.error?.message,
        loading: false,
      };
    case ActionTypes.AUTH_SIGNUP.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.AUTH_SIGNUP.SUCCESS:
      return {
        ...state,
        error: '',
        loading: false,
      };
    case ActionTypes.AUTH_SIGNUP.FAILURE:
      return {
        ...state,
        error: payload.error,
        loading: false,
      };
    case ActionTypes.AUTH_EMAIL_VERIFY.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.AUTH_EMAIL_VERIFY.SUCCESS:
      return {
        ...state,
        email_verified: true,
        loading: false,
      };
    case ActionTypes.AUTH_EMAIL_VERIFY.FAILURE:
      return {
        ...state,
        email_verified: false,
        loading: false,
      };
    case ActionTypes.AUTH_FORGOT_PASSWORD.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.AUTH_FORGOT_PASSWORD.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.AUTH_FORGOT_PASSWORD.FAILURE:
      return {
        ...state,
        error: payload.error.message,
        loading: false,
      };
    case ActionTypes.AUTH_RESET_PASSWORD.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case ActionTypes.AUTH_RESET_PASSWORD.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    case ActionTypes.AUTH_RESET_PASSWORD.FAILURE:
      return {
        ...state,
        error: payload.error.message,
        loading: false,
      };
    case ActionTypes.AUTH_LOGOUT.SUCCESS:
      return {
        ...state,
        authenticated: false,
        access_token: '',
      };
    default:
      return state;
  }
}
