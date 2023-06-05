import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ChatsApi from '../../api/ChatsApi';
// import deleteIcon from '../../assets/images/trash.png'
import DropzoneMessage from './Dropzone';
import MessageItem from './MessageItem';
import find from 'lodash-es/find';
import io from 'socket.io-client';

let interval = null;

const MessageChat = () => {
  const currentUser = useSelector((state) => state.users.user);
  const { chatId } = useParams();

  const [socket, setSocket] = useState(null);

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await ChatsApi.getChats();
      setChats(data.chats);
    })();

    interval = setInterval(() => {
      (async () => {
        try {
          const { data } = await ChatsApi.getMessages(chatId);
          setMessages(data.messages);
        } catch (e) {
          console.error(e);
        }
      })();
    }, 200);

    setSocket(io.connect(process.env.REACT_APP_SERVER_URL));

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('receiveNewMessage', (newMessages) => {
        setMessages([...messages, ...newMessages]);
      });
    }
  }, [socket]);

  const chat = find(chats, { id: parseInt(chatId, 10) }) || {};

  const sendMessage = (text) => {
    socket.emit('sendNewMessage', {
      chat_id: chat.id,
      sender_id: currentUser.id,
      viewed: false,
      type: 'message',
      text,
    });
  };

  let chatName = chat.name;
  if (!chatName && chat.users) {
    let otherUser = chat.users.filter((u) => u.id !== currentUser.id)[0];
    chatName = `Private chat with ${otherUser.first_name} ${otherUser.last_name}`;
  }

  return (
    <div className="chat_area">
      <div className="chat_header">
        <h2>{chatName}</h2>

        {/* <div className='chat_header_interface'>
          <img src={deleteIcon} alt=""/>

          <button>Mark as Unread</button>
        </div> */}
      </div>

      <div className="chat_main">
        {messages.map((message) =>
          message.chat_id === chat.id ? (
            <MessageItem key={message.id} message={message} chat={chat} />
          ) : null,
        )}
      </div>

      <div className="chat_addMessage">
        <DropzoneMessage onSend={sendMessage} />
      </div>
    </div>
  );
};

export default MessageChat;
