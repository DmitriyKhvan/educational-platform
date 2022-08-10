export default class BaseApi {
  REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
    ? process.env.REACT_APP_SERVER_URL
    : // : 'https://dev.naonow.contracollective.com'
      'https://naonow-backend-main.herokuapp.com'
  // 'https://dev.naonow.contracollective.com'
  //:'http://localhost:5434'

  getToken() {
    return localStorage.getItem('access_token')
  }

  _setHeader() {
    return {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }
  }
}
