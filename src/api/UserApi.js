import axios from 'axios';

import BaseApi from './BaseApi';

class UserApi extends BaseApi {

  uploadAvatar(avatar, user_id) {
    return axios.post(
      this.REACT_APP_SERVER_URL + '/users/upload-avatar',
      { avatar, user_id },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  uploadPreset(avatar, user_id) {
    return axios.put(
      this.REACT_APP_SERVER_URL + '/users/upload-avatar',
      { avatar, user_id },
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }

  getAvatar(file_name) {
    return axios.get(
      this.REACT_APP_SERVER_URL + '/users/get-avatar/?file_name=' + file_name,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
          responseType: 'blob',
        },
      },
    );
  }
}

export default new UserApi();
