import React from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import placeholderAvatar from '../assets/images/placeholder_avatar.png'

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
  const isToday = moment(time).isSame(moment(), 'day')
  return (
    <div className={'page-card grey-border bg-white pt-2 mt-4'} key={index}>
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
              src={placeholderAvatar}
              className='img-fluid align-middle'
              alt=''
              style={{ padding: '25px 0px 0px 25px' }}
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
          <a
            href='/student/schedule-lesson/select'
            className='enter-btn grey-border text-black'
          >
            {t('reschedule')}
          </a>
        </div>
        <div className='col-5'>
          <a
            href={zoomlink.url}
            target='_blank'
            rel='noreferrer'
            className='enter-btn grey-border text-black'
          >
            {t('join_lesson')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default CalendarModal
