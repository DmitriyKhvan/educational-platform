import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'
import placeholderAvatar from '../assets/images/avatars/img_avatar_female.png'
import ZoomWarningModal from './student-dashboard/ZoomWarningModal'
import { Link } from 'react-router-dom'

const CalendarModal = ({
  event,
  index,
  lesson,
  startTime,
  endTime,
  zoomlink,
  closeModal,
  time,
  data,
  onCancel
}) => {
  const [t] = useTranslation('translation')
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const isToday = moment(time).isSame(moment(), 'day')

  const avatar = data.resource?.tutor?.user.avatar
    ? data.resource?.tutor?.user.avatar
    : placeholderAvatar

  const today = moment()
  const tenMinuteBeforeStart = moment(
    data.resource.eventDate.start_at
  ).subtract(10, 'minutes')
  const fiveMinuteBeforeEnd = moment(data.resource.eventDate.start_at).add(
    data.resource.eventDate.duration - 5,
    'minutes'
  )

  const isBetween = moment(today).isBetween(
    tenMinuteBeforeStart,
    fiveMinuteBeforeEnd
  )

  const joinLesson = async () => {
    if (isBetween) {
      window.location.href = zoomlink.url
    } else {
      setIsWarningOpen(true)
    }
  }

  console.log(event)

  return (
    <div
      className={'page-card grey-border bg-white pt-2 mt-4'}
      key={index}
      style={{ maxWidth: '33vw' }}
    >
      <p className='close-sh' onClick={closeModal}>&times;</p>
      <div className='container'>
        <div className='row'>
          <div className='col-9'>
            <h1 className={'text-black'}>{lesson}</h1>
            {/* TODO: add this to translation.json */}
            <h3 className={'text-muted'}>
              {isToday ? 'Today' : moment(time).format('ddd')} at {startTime} →{' '}
              {endTime}
            </h3>
          </div>
          <div className='col-3'>
            <img
              src={avatar}
              className='img-fluid align-middle'
              alt=''
              style={{ padding: '25px 0px 0px 0px' }}
            />
          </div>
        </div>
      </div>
      <div className='schedule-modal-ls'>
          <button
            className='enter-btn grey-border text-black'
            onClick={() => onCancel(data.resource.eventDate.id)}
          >
            Cancel Lesson 
            {/* {t('cancel')} */}
          </button>
          <a
            href={'/student/schedule-lesson/select/' + data.resource.eventDate.id}
            className='enter-btn grey-border text-black'
          >
            {t('reschedule')}
          </a>
          <a
            onClick={joinLesson}
            target='_blank'
            rel='noreferrer'
            className='enter-btn grey-border text-black'
          >
            {t('join_lesson')}
          </a>
      </div>
      {isWarningOpen && (
        <ZoomWarningModal
          isWarningOpen={isWarningOpen}
          closeModal={onCancel}
          setIsWarningOpen={setIsWarningOpen}
        />
      )}
    </div>
  )
}

export default CalendarModal
