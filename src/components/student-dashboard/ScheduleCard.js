import React from 'react'
import placeholderAvatar from '../../assets/images/placeholder_avatar.png'
import { useTranslation } from 'react-i18next'

const ScheduleCard = ({ index, lesson, startTime, endTime, zoomlink }) => {
  const [t] = useTranslation('translation')

  return (
    <div
      className={`page-card ${
        index !== 0 ? 'purple' : 'grey-border bg-white'
      } small-card pt-2 mt-4`}
    >
      <div className="container">
        <div className="row">
          <div className="col-9">
            <h1 className={`${index !== 0 ? 'text-white' : 'text-black'}`}>
              {lesson}
            </h1>
            {/* TODO: add this to translation.json */}
            <h3 className={`${index !== 0 ? 'text-white' : 'text-muted'}`}>
              Today at {startTime} → {endTime}
            </h3>
          </div>
          <div className="col-3">
            <img
              src={placeholderAvatar}
              className="img-fluid align-middle"
              alt=""
              style={{ padding: '25px 0px 0px 25px' }}
            />
          </div>
        </div>
      </div>
      <div className="row p-0">
        <div className="col-3">
          <a
            href="/student/schedule-lesson/select"
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
            }`}
          >
            {t('cancel')}
          </a>
        </div>
        <div className="col-4">
          <a
            href="/student/schedule-lesson/select"
            className={`enter-btn ${
              index !== 0 ? 'text-purple' : 'grey-border text-black'
            }`}
          >
            {t('reschedule')}
          </a>
        </div>
        <div className="col-5 ps-1 pe-1">
          <a
            href={zoomlink.url}
            target="_blank"
            rel="noreferrer"
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
