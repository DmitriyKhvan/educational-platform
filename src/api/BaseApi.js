export default class BaseApi {
  REACT_APP_SERVER_URL = process.env.REACT_APP_SERVER_URL
  
  getToken() {
    return localStorage.getItem('token')
  }

  _setHeader() {
    return {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    }
  }
}
