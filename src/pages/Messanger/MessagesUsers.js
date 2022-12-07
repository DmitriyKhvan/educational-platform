import React from 'react'
import { NavLink } from 'react-router-dom'

const MessagesUsers = ( {base} ) => {
  return (
    <NavLink to={`/messages/chat/${base.tutor_name}/${base.type_message}`} activeClassName={"activeMessage"}>
      <div className='message_users_list'>
        <h3>{base.type_message}</h3>
        <div className='message_row'>
          <div className='message_user_left'>
            <h4>{base.type_lesson}</h4>
            <h5>{base.tutor_name}</h5>
          </div>
          <div className='message_user_right'>
            <h4>{base.date}</h4>
          </div>
        </div>
      </div>
    </NavLink>
  )
}

export default MessagesUsers
