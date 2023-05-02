import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';

const MessagesUsers = ({ chat }) => {
  const currentUser = useSelector((state) => state.users.user);

  let chatName = chat.name;
  if (!chatName) {
    let otherUser = chat.users.filter((u) => u.id !== currentUser.id)[0];
    console.log('otherUser', otherUser);
    chatName = `Private chat with ${otherUser.first_name} ${otherUser.last_name}`;
  }

  return (
    <NavLink to={`/messages/${chat.id}`} activeClassName={'activeMessage'}>
      <div className="message_users_list">
        <h3>{chatName}</h3>
        <div className="message_row">
          {chat.users.map((user) =>
            currentUser.id !== user.id ? (
              <div key={user.id} className="message_user_left">
                <h4>English lesson</h4>
                <h5>
                  {user.first_name} {user.last_name}
                </h5>
              </div>
            ) : null,
          )}
          <div className="message_user_right">
            <h4>{format(parseISO(chat.updatedAt), 'MM/dd/yyyy')}</h4>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default MessagesUsers;
