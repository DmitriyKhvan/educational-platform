import React from 'react';
import avatarTutor from '../../assets/images/nao.png';
import formatDistance from 'date-fns/formatDistance';
import parseISO from 'date-fns/parseISO';

const avatars = {
  3: 'https://media.istockphoto.com/id/1365223878/photo/attractive-man-feeling-cheerful.jpg?b=1&s=170667a&w=0&k=20&c=Pt_reBU6pAQV6cXnIcBSLdtYSB4a_8MJM4qWAO_0leU=',
  11: avatarTutor,
  14: 'https://img.freepik.com/free-photo/lifestyle-people-emotions-and-casual-concept-confident-nice-smiling-asian-woman-cross-arms-chest-confident-ready-to-help-listening-to-coworkers-taking-part-conversation_1258-59335.jpg?w=2000',
};

const MessageItem = ({ message, chat }) => {
  return (
    <div className="message_item">
      <div className="message_item_header">
        <div className="message_item_header_info">
          <div>
            <img src={avatars[message.sender.id]} alt="" />
          </div>

          <div>
            <h2>
              {message.sender.first_name} {message.sender.last_name}
            </h2>
            <p>{chat.name}</p>
          </div>
        </div>
        <div className="message_item_header_data">
          <p>{formatDistance(parseISO(message.createdAt), new Date())}</p>
        </div>
      </div>

      <div className="message_text">
        <p
          dangerouslySetInnerHTML={{
            __html: message.text.replace('\n', '<br />'),
          }}
        />
      </div>
    </div>
  );
};

export default MessageItem;
