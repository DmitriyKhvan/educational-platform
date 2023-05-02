import axios from 'axios';
import queryString from 'query-string';
import BaseApi from './BaseApi';

class AppointmentApi extends BaseApi {
  getAppointments(params = {}) {
    let query = queryString.stringify(params);
    return axios.get(`${this.REACT_APP_SERVER_URL}/groups?${query}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  createLessonExist(data) {
    return axios.post(this.REACT_APP_SERVER_URL + '/lessons/create', data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  createLessonExist(data) {
    return axios.post(this.REACT_APP_SERVER_URL + '/lessons/create', data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`
      }
    })
  }

  createAppointment(data) {
    return axios.post(this.REACT_APP_SERVER_URL + '/groups', data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  approveAppointment(id) {
    return axios.get(`${this.REACT_APP_SERVER_URL}/groups/approve/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  cancelAppointment(id) {
    return axios.get(`${this.REACT_APP_SERVER_URL}/groups/cancel/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  updateAppointment(id, data) {
    return axios.put(`${this.REACT_APP_SERVER_URL}/groups/${id}`, data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  completeLesson(data) {
    return axios.put(`${this.REACT_APP_SERVER_URL}/groups/complete`, data, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  cancelLesson(id) {
    return axios.get(`${this.REACT_APP_SERVER_URL}/groups/cancel/${id}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }

  joinLesson(id) {
    return axios.post(
      `${this.REACT_APP_SERVER_URL}/groups/join`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  addFeedbackToStudent(data) {
    return axios.post(
      `${this.REACT_APP_SERVER_URL}/groups/student-feedback`,
      data,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  fetchLessonTypes(data = {}) {
    let query = queryString.stringify(data);
    return axios.get(`${this.REACT_APP_SERVER_URL}/lessons?${query}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
}

export default new AppointmentApi();
