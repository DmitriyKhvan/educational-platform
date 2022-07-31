import React from 'react'
import moment from 'moment'

const ScheduleCard = ({ time, duration }) => {
  time = moment(time).format()
  const scheduleEndTime = moment(time, [moment.ISO_8601, 'HH:mm'])
    .add(duration, 'minutes')
    .format('hh:mm A')

  return (
    <div
      className={`schedule_change_padd time-card schedule-lesson-border bg-white small-card pt-2 mt-1 schedule-lesson-border-widths`}
    >
      <div className='row alignmobile'>
        <div className='col-auto schedule_card_aligns'>
          <h3 className={`inside-align-title-time ms-3`}>
            {moment(time, [moment.ISO_8601, 'HH:mm']).format('hh:mm A')} →{' '}
            {scheduleEndTime}
          </h3>
        </div>
        <div className='col-auto pt-0 check'>
          <div className='schedule-card-col  align-date'>
            <p
              className={` time-btn schedule-lesson-border confirm-tutor-enter-btn tutor_date_padd`}
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
