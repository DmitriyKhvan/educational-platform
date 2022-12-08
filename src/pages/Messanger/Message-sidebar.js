import React from 'react'
import MessagesUsers from './MessagesUsers'

const userList = [
  {
    id:1,
    type_message: "Nao Now Level 2: Golden Gate Bridge",
    type_lesson: "English Lesson",
    tutor_name: "Sarah B.",
    date: "3:45pm"
  },
  {
    id:2,
    type_message: "Message",
    type_lesson: "Debate Lesson",
    tutor_name: "Nathan H.",
    date: "Yesterday"
  },
  {
    id:42,
    type_message: "Message",
    type_lesson: "Writing Lesson",
    tutor_name: "Imani K.",
    date: "3 days ago"
  },
  {
    id:3,
    type_message: "Weekly Report",
    type_lesson: "Report, Aug 10,2021",
    tutor_name: "NaoNow",
    date: "1 week ago"
  },
  {
    id:4,
    type_message: "Message",
    type_lesson: "English Lesson",
    tutor_name: "Harry R.",
    date: "2 month ago"
  },
]

const MessageSidebar = () => {


  return (
    <div className='message_sidebar'>
      <div className='message_sidebar_top'>
        <div className='message_sidebar_top_title'>
          <h2>Message</h2>

          <div className='message_count'>
            <span>3</span>
          </div>
        </div>

        <div className='message_sidebar_top_filter'>
          <select>
            <option>All Messages</option>
          </select>
        </div>
      </div>

      <div className='message_users'>
        {
          userList.map(item => <MessagesUsers key={item.id} base={item}/>)
        }
      </div>
    </div>
  )
}

export default MessageSidebar
