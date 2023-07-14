import axios from 'axios';
import BaseApi from './BaseApi';
import queryString from 'query-string';

class SubscriptionApi extends BaseApi {
  getSubscriptions(data) {
    const { group_type, lesson_type, duration } = data;
    return axios.get(
      `${
        this.REACT_APP_SERVER_URL
      }/payments/plans?group_type=${group_type}&lesson_type=${lesson_type}&duration=${parseInt(
        duration,
      )}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  createPlan(plan) {
    return axios.post(
      this.REACT_APP_SERVER_URL + '/payments/plan',
      { plan },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  updatePlan(plan) {
    return axios.put(
      this.REACT_APP_SERVER_URL + '/payments/plan',
      { plan },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  getPlan(data) {
    const { group_type, lesson_type, duration, period } = data;
    return axios.get(
      `${
        this.REACT_APP_SERVER_URL
      }/payments/plan?group_type=${group_type}&lesson_type=${lesson_type}&duration=${parseInt(
        duration,
      )}${period ? '&period=' + period : ''}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  getPlanStatus(data) {
    const query = queryString.stringify(data);
    return axios.get(`${this.REACT_APP_SERVER_URL}/payments/status?${query}`, {
      headers: {
        Authorization: `Bearer ${this.getToken()}`,
      },
    });
  }
}

export default new SubscriptionApi();
