import React from 'react'
import { useParams } from 'react-router-dom';

const MessageChat = () => {
  const { name } = useParams();

  
  return (
    <div>
      Chat
    </div>
  )
}

export default MessageChat;
