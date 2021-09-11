import React, { useCallback, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import '../assets/styles/messages.scss'
import { useDispatch, useSelector } from 'react-redux'
import { getUserInfo } from '../actions/user'
import { getMessage } from '../actions/message'
import io from 'socket.io-client'
import NotificationManager from '../components/NotificationManager.js'
import Loader from 'react-loader-spinner'
import { useHistory } from 'react-router'
import { useTranslation } from 'react-i18next'
import { fetchStudents, fetchTutors } from '../actions/admin'
import { getAbbrName, getAvatarName } from '../constants/global'
import { Avatar } from '../components/Avatar'

const SERVER_URL = process.env.REACT_APP_SERVER_URL
  ? process.env.REACT_APP_SERVER_URL
  : 'https://dev.naonow.contracollective.com'

const Messages = () => {
  const [t, i18n] = useTranslation('translation')

  const [currentReceiver, setCurrentReceiver] = useState(null)
  const [receivers, setReceivers] = useState([])
  const [messages, setMessages] = useState({})
  const prevMessages = useSelector(state => state.message.data)
  const loadingPrevMsgs = useSelector(state => state.message.loading)
  const history = useHistory()

  const user = useSelector(state => state.users.user)
  const dispatch = useDispatch()

  const [socket, setSocket] = useState()
  const [text, setText] = useState('')

  const [isTutor, setIsTutor] = useState(null)

  const { tutors, students, loading } = useSelector(state => state.admin)

  useEffect(() => {
    if (user && user.roles) {
      if (user.roles[0].role_name === 'tutor') {
        setIsTutor(true)
      } else if (user.roles[0].role_name === 'student') {
        setIsTutor(false)
      } else {
        setIsTutor(null)
      }
    }
  }, [user])

  useEffect(() => {
    dispatch(getUserInfo())
  }, [dispatch])

  useEffect(() => {
    if (user && user.roles && (user?.tutor_profile || user?.student_profile)) {
      if (user.roles[0].role_name === 'tutor') {
        dispatch(fetchStudents({ tutor_id: user.tutor_profile.id }))
      } else if (user.roles[0].role_name === 'student') {
        dispatch(fetchTutors({ student_id: user.student_profile.id }))
      }
    }
  }, [user])

  /** fetch connectors */
  useEffect(() => {
    if (isTutor === null) return

    if ((tutors && tutors.length > 0) || (students && students.length > 0)) {
      let receivers = []
      if (isTutor) {
        receivers = students.map(student => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`,
          abbrName: getAvatarName(student.first_name, student.last_name),
          image: student.avatar
        }))
      } else {
        receivers = tutors.map(tutor => ({
          id: tutor.id,
          name: `${tutor.first_name} ${tutor.last_name}`,
          abbrName: getAvatarName(tutor.first_name, tutor.last_name),
          image: tutor.avatar
        }))
      }
      let selected_user_id = parseInt(history.location.state?.user_id)
      setReceivers(receivers)
      const currentReceiver =
        (receivers &&
          receivers.length > 0 &&
          (!!selected_user_id
            ? receivers.filter(receiver => receiver.id === selected_user_id)[0]
            : receivers[0])) ||
        null
      setCurrentReceiver(currentReceiver)
      if (user.id && currentReceiver && !socket) {
        setSocket(io.connect(SERVER_URL))
      }
    }
  }, [tutors, students])

  /** binding socket callbacks */
  useEffect(() => {
    if (socket) {
      socket.off('receiveMessage')
      socket.on('receiveMessage', onMessageRecieved)
      socket.off('join')
      socket.on('join', onUserJoined)
      socket.off('disconnect')
      socket.on('disconnect', onDisconnect)
    }
  }, [socket])

  useEffect(() => {
    if (socket) {
      socket.off('receiveMessage')
      socket.on('receiveMessage', onMessageRecieved)
    }
  }, [currentReceiver])

  /** socket callbacks */
  const onMessageRecieved = info => {
    const { sender, receiver, message } = info
    let myMessage = sender === user.id
    let id = myMessage ? receiver : sender
    if (!messages[id]) messages[id] = []
    if (myMessage) {
      messages[id].push({
        myMessage,
        message,
        image: user.avatar,
        abbrName: `${(user.first_name || '').charAt(0).toUpperCase()}${(
          user.last_name || ''
        )
          .charAt(0)
          .toUpperCase()}`
      })
    } else {
      let receiver = currentReceiver
      if (currentReceiver.id !== sender) {
        receiver = receivers.filter(receiver => receiver.id === sender)[0]
        if (!receiver.unread) receiver.unread = 0
        receiver.unread++
        setReceivers(JSON.parse(JSON.stringify(receivers)))
      }
      if (receiver) {
        messages[id].push({
          myMessage,
          message,
          image: receiver.image,
          abbrName: receiver.abbrName
        })
      }
    }
    setMessages(JSON.parse(JSON.stringify(messages)))
    setTimeout(() => {
      onScrollBottom()
    }, 100)
  }

  const onScrollBottom = () => {
    let last_message = document.querySelector('.message-item:last-child')
    if (last_message) last_message.scrollIntoView({ behavior: 'smooth' })
  }

  const onUserJoined = () => {
    socket.emit('join', user.id)
  }
  const onDisconnect = () => {}

  /** ui handlers */
  const selectReceiver = id => {
    let currentReceiver = receivers.find(receiver => receiver.id === id)
    currentReceiver.unread = 0
    setCurrentReceiver(currentReceiver)
  }

  const loadMessage = () => {
    const sender = user.id
    const receiver = currentReceiver.id
    const isFirst = Object.keys(messages).indexOf(receiver.toString()) === -1
    const last_id = isFirst ? -1 : messages[receiver][0].id || -1
    const offset = 20
    dispatch(getMessage(sender, receiver, last_id, offset))
  }

  useEffect(() => {
    if (currentReceiver && !loadingPrevMsgs) {
      const isFirst =
        Object.keys(messages).indexOf(currentReceiver.id.toString()) === -1
      if (isFirst) loadMessage()
      else onScrollBottom()
    }
  }, [currentReceiver])

  useEffect(() => {
    if (prevMessages.length > 0 && currentReceiver) {
      const isFirst =
        Object.keys(messages).indexOf(currentReceiver.id.toString()) === -1
      prevMessages.forEach(info => {
        const { sender, receiver, message, id } = info
        let myMessage = sender === user.id
        let userid = myMessage ? receiver : sender
        if (!messages[userid]) messages[userid] = []
        if (myMessage) {
          messages[userid].unshift({
            id,
            myMessage,
            message,
            image: user.avatar,
            abbrName: `${(user.first_name || '').charAt(0).toUpperCase()}${(
              user.last_name || ''
            )
              .charAt(0)
              .toUpperCase()}`
          })
        } else {
          let receiver = currentReceiver
          if (currentReceiver.id !== sender) {
            receiver = receivers.filter(receiver => receiver.id === sender)[0]
          }
          if (receiver) {
            messages[userid].unshift({
              id,
              myMessage,
              message,
              image: receiver.image,
              abbrName: receiver.abbrName
            })
          }
        }
      })
      setReceivers(JSON.parse(JSON.stringify(receivers)))
      setMessages(JSON.parse(JSON.stringify(messages)))
      if (isFirst) {
        setTimeout(() => {
          onScrollBottom()
        }, 100)
      }
    }
  }, [prevMessages])

  const sendMessage = () => {
    if (text.trim() === '') return
    const message = {
      sender: user.id,
      receiver: currentReceiver.id,
      message: text
    }
    setText('')
    socket.emit('sendMessage', message)
  }
  return (
    <Layout>
      <span>{String.fromCharCode('&#9733')}</span>
      <div className="view-messages">
        <div className="header-title">
          <h4 className="main-title">{t('view_messages')}</h4>
          <p>
            {t('talk_with_directly', {
              person: isTutor ? t('student') : t('tutor')
            })}
          </p>
        </div>
        <div className="divider" />
        <div className="messages-window">
          {(!receivers || (receivers && receivers.length === 0)) && (
            <span className="no-chat-history">{t('no_chat_history')}</span>
          )}
          <div className="message-receivers">
            {receivers &&
              receivers.length > 0 &&
              receivers.map((receiver, index) => (
                <div
                  key={`reciever-${index}`}
                  className={`message-receiver ${
                    receiver.id === currentReceiver.id ? 'active' : ''
                  }`}
                  onClick={() => selectReceiver(receiver.id)}
                  key={receiver.id}
                >
                  <div className="message-inner">
                    <Avatar avatar={receiver.image} name={receiver.abbrName} />
                    <p>{receiver.name}</p>
                    {!!receiver.unread && (
                      <span className="badge">{receiver.unread}</span>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {currentReceiver && (
            <div className="message-content">
              <div className="message-content-header">
                <p>
                  {t('between_you_and_person', { name: currentReceiver.name })}
                </p>
              </div>
              <div className="messages">
                <div className="load-prev-messages">
                  <a href="#" onClick={loadMessage}>
                    {t('load_messages')}
                  </a>
                </div>
                {messages[currentReceiver.id] &&
                  messages[currentReceiver.id].map((message, index) => (
                    <div
                      className={`message-item ${
                        message.myMessage ? 'sender-message' : 'client-message'
                      }`}
                      key={`message-item-${index}`}
                    >
                      <div className="user-image">
                        <Avatar
                          avatar={message.image}
                          name={message.abbrName}
                        />
                      </div>
                      <div className="message-text">
                        <p>{message.message}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="message-input submit-action">
                <div className="user-image">
                  <Avatar
                    avatar={user.avatar}
                    name={getAvatarName(user.first_name, user.last_name)}
                  />
                </div>
                <input
                  type="text"
                  disabled={loadingPrevMsgs || !socket}
                  placeholder={t('type_your_message')}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') sendMessage()
                  }}
                />
              </div>
              <div className="btn-container">
                <button className="send-message" onClick={sendMessage}>
                  {t('send_message')}
                </button>
              </div>
              {loadingPrevMsgs && (
                <div className="loading">
                  <div className="trans-bg" />
                  <Loader
                    className="align-center"
                    type="Audio"
                    color="#00BFFF"
                    height={50}
                    width={50}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Messages
