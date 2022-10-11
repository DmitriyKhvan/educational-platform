import React from 'react'

const ScheduleCard = ({ startTime, endTime, date }) => {
  return (
    <div
      className={`schedule_change_padd time-card schedule-lesson-border bg-white small-card pt-2 mt-1 schedule-lesson-border-widths`}
    >
      <div className='row alignmobile'>
        <div className='col-auto schedule_card_aligns'>
          <h3 className={`inside-align-title-time ms-3`}>
            {startTime} → {endTime}
          </h3>
        </div>
        <div className='col-auto pt-0 check'>
          <div className='schedule-card-col  align-date'>
            <p
              className={` time-btn schedule-lesson-border confirm-tutor-enter-btn tutor_date_padd`}
            >
              {date}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScheduleCard
