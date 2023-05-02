import axios from 'axios';
import BaseApi from './BaseApi';

class MessageApi extends BaseApi {
  getMessage(sender, receiver, last_id = -1, limit = 20) {
    return axios.get(
      `${this.REACT_APP_SERVER_URL}/messages?sender=${sender}&receiver=${receiver}&last_id=${last_id}&limit=${limit}`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`,
        },
      },
    );
  }
}

export default new MessageApi();
