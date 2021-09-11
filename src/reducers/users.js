import ActionTypes from '../constants/actionTypes'

const initialState = {
  loading: false,
  user: {},
  upload_avatar: '',
  user_avatar: null
}

export default function users(state = initialState, action) {
  let { payload } = action

  switch (action.type) {
    case ActionTypes.GET_USER.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.GET_USER.SUCCESS:
      return {
        ...state,
        user: payload.user,
        loading: false
      }
    case ActionTypes.GET_USER.FAILURE:
      return {
        ...state,
        loading: false
      }
    case ActionTypes.UPLOAD_AVATAR.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.UPLOAD_AVATAR.SUCCESS:
      return {
        ...state,
        upload_avatar: payload.message,
        loading: false
      }
    case ActionTypes.UPLOAD_AVATAR.FAILURE:
      return {
        ...state,
        upload_avatar:
          payload?.message ||
          'Your image is not valid, Photo should be smaller than 8 MB.',
        loading: false
      }
    case ActionTypes.GET_AVATAR.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.GET_AVATAR.SUCCESS:
      return {
        ...state,
        user_avatar: payload,
        loading: false
      }
    case ActionTypes.GET_AVATAR.FAILURE:
      return {
        ...state,
        user_avatar: null,
        loading: false
      }
    case ActionTypes.UPDATE_USER.REQUEST:
      return {
        ...state,
        loading: true
      }
    case ActionTypes.UPDATE_USER.SUCCESS:
      return {
        ...state,
        loading: false
      }
    case ActionTypes.UPDATE_USER.FAILURE:
      return {
        ...state,
        loading: false
      }
    default:
      return state
  }
}
