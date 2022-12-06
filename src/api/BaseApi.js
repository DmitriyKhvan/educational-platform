export default class BaseApi {
  REACT_APP_SERVER_URL =
    process.env.REACT_APP_SERVER_URL || 'http://localhost:5000'

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
