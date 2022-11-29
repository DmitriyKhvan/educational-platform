import axios from 'axios'
import BaseApi from './BaseApi'
import queryString from 'query-string'

class AdminApi extends BaseApi {
  getUserById(id) {
    return axios.get(`${this.REACT_APP_SERVER_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  fetchStudents(data) {
    const query = queryString.stringify(data)
    return axios.get(`${this.REACT_APP_SERVER_URL}/students?${query}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  fetchTutors(data) {
    const query = queryString.stringify(data)
    return axios.get(`${this.REACT_APP_SERVER_URL}/tutors?${query}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }


  
  fetchTutorRate() {
    return axios.get( `${this.REACT_APP_SERVER_URL}/tutors/rates`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  updateTutorHourlyRate(data) {
    return axios.post(`${this.REACT_APP_SERVER_URL}/tutors/rates`, data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  confirmationReferal(id) {
    return axios.put(`${this.REACT_APP_SERVER_URL}/users/${id}/confirm-referal`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }
}

export default new AdminApi()
