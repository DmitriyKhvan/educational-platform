import axios from 'axios';

import BaseApi from './BaseApi';

class AuthApi extends BaseApi {
  login(email, password) {
    return axios.post(this.REACT_APP_SERVER_URL + '/auth/login', {
      email,
      password,
    });
  }

  signup(
    first_name,
    last_name,
    phone_number,
    email,
    password,
    user_role,
    referal_code = null,
  ) {
    return axios.post(this.REACT_APP_SERVER_URL + '/auth/register', {
      first_name,
      last_name,
      phone_number,
      email,
      password,
      user_role,
      referal_code,
    });
  }

  verifyEmail(token) {
    return axios.get(
      this.REACT_APP_SERVER_URL + '/auth/verify-email/?token=' + token,
    );
  }

  forgotPassword(email) {
    return axios.post(this.REACT_APP_SERVER_URL + '/auth/forgot-password', {
      email,
    });
  }

  resetPassword(password, token) {
    return axios.put(this.REACT_APP_SERVER_URL + '/auth/reset-password', {
      password,
      token,
    });
  }
}

export default new AuthApi();
