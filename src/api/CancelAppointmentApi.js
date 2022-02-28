import axios from 'axios'
import BaseApi from './BaseApi'

class CancelAppointmentApi extends BaseApi {
  getCancelAppointmentById() {
    return axios.get(
      `${this.REACT_APP_SERVER_URL}/cancel-appointment`,
      this._setHeader
    )
  }

  getCancelAppointmentMonthById(id) {
    return axios.get(
      `${this.REACT_APP_SERVER_URL}/cancel-appointment/month/${id}`,
      this._setHeader
    )
  }

  createCancelAppointment() {
    return axios.post(
      `${this.REACT_APP_SERVER_URL}/cancel-appointment`,
      this._setHeader
    )
  }
}

export default new CancelAppointmentApi()
