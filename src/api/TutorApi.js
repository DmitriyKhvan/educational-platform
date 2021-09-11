import axios from 'axios'
import queryString from 'query-string'

import BaseApi from './BaseApi'

class TutorApi extends BaseApi {
  getTutorInfo(tutor_id) {
    return axios.get(this.REACT_APP_SERVER_URL + '/tutors/' + tutor_id, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  getTutorList(from, timezone = null) {
    let obj = { from }
    if (timezone) {
      obj.timezone = timezone
    }
    return axios.get(
      `${
        this.REACT_APP_SERVER_URL
      }/tutors/available-list?${queryString.stringify(obj)}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }

  updateTutorAvailability(availabilities, tutor_id) {
    return axios.post(
      this.REACT_APP_SERVER_URL + '/tutors/availability',
      { availabilities, tutor_id },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }

  updateExceptionDates(exceptiondates, tutor_id) {
    return axios.post(
      this.REACT_APP_SERVER_URL + '/tutors/exceptiondates',
      { exceptiondates, tutor_id },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }

  updateTutorInfo(data) {
    return axios.put(this.REACT_APP_SERVER_URL + '/tutors/update', data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  getOverallStatus(data) {
    const query = queryString.stringify(data)

    return axios.get(
      `${this.REACT_APP_SERVER_URL}/tutors/overall-summary?${query}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }

  getPaymentHistory(data) {
    const query = queryString.stringify(data)

    return axios.get(
      `${this.REACT_APP_SERVER_URL}/tutors/payment-history?${query}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }

  delete(id) {
    return axios.delete(`${this.REACT_APP_SERVER_URL}/tutors/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  getReview(id) {
    return axios.get(`${this.REACT_APP_SERVER_URL}/tutors/review/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }
}

export default new TutorApi()
