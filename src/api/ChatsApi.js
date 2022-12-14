import axios from 'axios'
import BaseApi from './BaseApi'

class ChatsApi extends BaseApi {
  getChats() {
    return axios.get(
      `${this.REACT_APP_SERVER_URL}/chats`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }

  getMessages(chatId) {
    return axios.get(
      `${this.REACT_APP_SERVER_URL}/chats/${chatId}/messages`,
      {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      }
    )
  }
}

export default new ChatsApi()
