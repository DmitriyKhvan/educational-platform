const initialState = {
  isShowSidebar: false
}

export default function auth(state = initialState, action) {
  switch (action.type) {
    case 'SHOW_SIDEBAR':
      return {
        ...state,
        isShowSidebar: true
      }
    case 'HIDE_SIDEBAR':
      return {
        ...state,
        isShowSidebar: false
      }
    default:
      return state
  }
}
