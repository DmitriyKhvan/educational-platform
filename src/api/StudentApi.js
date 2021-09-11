import axios from 'axios'
import BaseApi from './BaseApi'
import queryString from 'query-string'

class StudentApi extends BaseApi {
  getStudent(student_id) {
    return axios.get(this.REACT_APP_SERVER_URL + '/students/' + student_id, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  updateStudent(data) {
    return axios.put(this.REACT_APP_SERVER_URL + '/students/update', data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  setFavourite(data) {
    return axios.post(this.REACT_APP_SERVER_URL + '/students/favorite', data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  getStudentList(data) {
    const query = queryString.stringify(data)
    return axios.get(`${this.REACT_APP_SERVER_URL}/students?${query}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  setReview(data) {
    return axios.post(`${this.REACT_APP_SERVER_URL}/students/review`, data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  setTutorAttendance(id, data) {
    return axios.post(
      `${this.REACT_APP_SERVER_URL}/students/group-attendance/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }

  delete(id) {
    return axios.delete(`${this.REACT_APP_SERVER_URL}/students/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  getAvailableStudents(from, timezone = null) {
    let obj = { from }
    if (timezone) {
      obj.timezone = timezone
    }
    return axios.get(
      `${
        this.REACT_APP_SERVER_URL
      }/students/available-list?${queryString.stringify(obj)}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }
}

export default new StudentApi()
