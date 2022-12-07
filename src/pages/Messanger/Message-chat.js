import React from 'react'
import { useParams } from 'react-router-dom';
import deleteIcon from '../../assets/images/trash.png';
import MessageItem from './MessageItem';
import AttachmentIcon from '../../assets/images/Attachment icon.png';


const MessageChat = () => {
  const { name, mode } = useParams();
  
  return (
    <div className='chat_area'>
      <div className='chat_header'>
        <h2>{mode}</h2>

        <div className='chat_header_interface'>
          <img src={deleteIcon} alt=""/>

          <button>Mark as Unread</button>
        </div>
      </div>

      <div className='chat_main'>
        <MessageItem name={name}/>
      </div>

      <div className="chat_addMessage">
        <div className="input_area">
          <img src={AttachmentIcon} alt=""/>

          <input 
            type="text"
            placeholder="Write a message"
          />

          <button>Send</button>
        </div>
      </div>  
    </div>
  )
}

export default MessageChat;
