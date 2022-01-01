import React from 'react'
import { useTranslation } from 'react-i18next'
import moment from 'moment'
import femaleAvatar from '../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../assets/images/avatars/img_avatar_male.png'

const ScheduleCard = ({ index, lesson, zoomlink, date, data }) => {
  const [t] = useTranslation('translation')
  date = date.length > 9 ? date * 1000 : date
  const isToday = moment(date).isSame(moment(), 'day')
  let gender
  if (data.tutor?.gender) {
    gender = data.tutor.gender
  }
  const endEpoch = date + data.duration * 60
  const startTime = moment.unix(date).format('LT')
  const endTime = moment.unix(endEpoch).format('LT')
  return (
    <div
      className={`page-card ${
        index !== 0 ? 'purple' : 'grey-border bg-white'
      } small-card pt-2 mt-4`}
    >
      <div className='container'>
        <div className='row'>
          <div className='col-9'>
            <h1 className={`${index !== 0 ? 'text-white' : 'text-black'}`}>
              {lesson}
            </h1>
            {/* TODO: add this to translation.json */}
            <h3 className={`${index !== 0 ? 'text-white' : 'text-muted'}`}>
              {isToday ? 'Today' : moment(date).format('ddd')} at {startTime} →{' '}
              {endTime}
            </h3>
          </div>
          <div className='col-3'>
            <img
              src={gender === 'male' ? maleAvatar : femaleAvatar}
              className='img-fluid align-middle schedule-image rounded-corners'
              alt=''
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className='schedule-card-col'>
          {/* <a
            href='/student/schedule-lesson/select'
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
            }`}
          >
            {t('cancel')}
          </a> */}
        </div>
        <div className='schedule-card-col'>
          <a
            href='/student/schedule-lesson/select'
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
            }`}
          >
            {t('reschedule')}
          </a>
        </div>
        <div className='schedule-card-col'>
          <a
            href={zoomlink.url}
            target='_blank'
            rel='noreferrer'
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
            }`}
          >
            {t('join_lesson')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ScheduleCard
