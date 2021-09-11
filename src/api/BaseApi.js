export default class BaseApi {
  REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : 'https://dev.naonow.contracollective.com'

  getToken() {
    return localStorage.getItem('access_token')
  }
}
