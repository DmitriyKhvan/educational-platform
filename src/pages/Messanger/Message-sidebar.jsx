import React, { useState, useEffect } from 'react';
// import ChatsApi from '../../api/ChatsApi';
import Chat from './Chat';

const MessageSidebar = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    (async () => {
      // const { data } = await ChatsApi.getChats();
      // setChats(data.chats);
      setChats([]);
    })();
  }, []);

  return (
    <div className="message_sidebar">
      <div className="message_sidebar_top">
        <div className="message_sidebar_top_title">
          <h2>Message</h2>

          <div className="message_count">
            <span>3</span>
          </div>
        </div>

        <div className="message_sidebar_top_filter">
          <select>
            <option>All Messages</option>
          </select>
        </div>
      </div>

      <div className="message_users">
        {chats.map((chat) => (
          <Chat key={chat.id} chat={chat} />
        ))}
      </div>
    </div>
  );
};

export default MessageSidebar;
