import React from 'react'
import { useParams } from 'react-router-dom';
import deleteIcon from '../../assets/images/trash.png';
import DropzoneMessage from './Dropzone';
import MessageItem from './MessageItem';


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
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>

        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>
        <MessageItem name={name}/>

        <MessageItem name={name}/>

        <MessageItem name={name}/>

        
      </div>

      <div className="chat_addMessage">
        <DropzoneMessage />
      </div>  
    </div>
  )
}

export default MessageChat;
