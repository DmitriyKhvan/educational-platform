import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import placeholderAvatar from '../assets/images/avatars/img_avatar_female.png'
import ZoomWarningModal from './student-dashboard/ZoomWarningModal'
import { Link } from 'react-router-dom'

const CalendarModal = ({
  index,
  lesson,
  startTime,
  endTime,
  zoomlink,
  time,
  data,
  onCancel
}) => {
  const [t] = useTranslation('translation')
  const [isWarningOpen, setIsWarningOpen] = useState(false)
  const isToday = moment(time).isSame(moment(), 'day')
  // const date = moment.unix(startTime)
  // const startTimeEpoch = moment.unix(date)
  // const oneMinuteAfterStart = moment.unix(
  //   moment(startTimeEpoch).unix() + 60 * 60
  // const fiveMinutesBefore = moment.unix(moment(startTimeEpoch).unix() - 10 * 60)
  // )

  const avatar = data.resource?.tutor?.user.avatar
    ? data.resource?.tutor?.user.avatar
    : placeholderAvatar

  const today = moment().utc(true)
  const hourAfter = moment(data.resource.eventDate.start_at)
    .utc(0, true)
    .add(59, 'minutes')
  const tenMinutesbefore = moment(data.resource.eventDate.start_at)
    .utc(0, true)
    .subtract(10, 'minutes')
  const isBetween = moment(today).isBetween(tenMinutesbefore, hourAfter)

  const joinLesson = async () => {
    window.location.href = zoomlink.url
  }
  return (
    <div
      className={'page-card grey-border bg-white pt-2 mt-4'}
      key={index}
      style={{ maxWidth: '33vw' }}
    >
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
      <div className='row'>
        <div className='col-3'>
          <button
            className='enter-btn grey-border text-black'
            onClick={() => onCancel(data.resource.eventDate.id)}
          >
            {t('cancel')}
          </button>
        </div>
        <div className='col-4'>
          <Link
            to={'/student/schedule-lesson/select/' + data.resource.eventDate.id}
            className='enter-btn grey-border text-black'
          >
            {t('reschedule')}
          </Link>
        </div>
        <div className='col-5'>
          <a
            onClick={joinLesson}
            target='_blank'
            rel='noreferrer'
            className='enter-btn grey-border text-black'
          >
            {t('join_lesson')}
          </a>
        </div>
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
