import React from 'react'
import moment from 'moment'

const ScheduleCard = ({ time, duration }) => {
  time = moment(time).format()
  const scheduleEndTime = moment(time, [moment.ISO_8601, 'HH:mm'])
    .add(duration, 'minutes')
    .format('hh:mm A')

  return (
    <div
      className={`time-card schedule-lesson-border bg-white small-card pt-2 mt-2`}
    >
      <div className='row container'>
        <div className='col-auto'>
          <h3 className={`text-black`}>
            {moment(time, [moment.ISO_8601, 'HH:mm']).format('hh:mm A')} →{' '}
            {scheduleEndTime}
          </h3>
        </div>
        <div className='col-auto pt-2'>
          <div className='schedule-card-col px-3'>
            <p
              className={`enter-btn time-btn schedule-lesson-border text-black`}
            >
              {moment(time).format('dddd, MMM DD')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleCard
