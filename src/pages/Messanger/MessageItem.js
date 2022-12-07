import React from 'react'
import Tut from "../../assets/images/nao.png"

const MessageItem = ({name}) => {
  return (
    <div className='message_item'>
      <div className='message_item_header'>
        <div className='message_item_header_info'>
          <div>
            <img src={Tut} alt=""/>
          </div>

          <div>
            <h2>{name}</h2>
            <p>Nao Now Level 2</p>
          </div>
        </div>
        <div className='message_item_header_data'>
          <p>Today at 2:45pm</p>
        </div>
      </div>

      <div className='message_text'>
        <p>
          Good Afternoon,

          I wanted to reach out as I'm unable to attend our English lesson on August 26th.

          Would you like to reschedule to another date or have another tutor assigned?

          With kind regards,
          Rachel
        </p>
      </div>
    </div>
  )
}

export default MessageItem
