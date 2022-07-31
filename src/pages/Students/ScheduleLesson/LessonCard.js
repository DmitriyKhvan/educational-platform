import React from 'react'

const LessonCard = ({ lesson, duration, remaining }) => (
  <div
    className={
      'time-card schedule-lesson-border schedule-lesson-border-width  bg-white small-card schedule_change_padd'
    }
  >
    <div className='containers-fluids '>
      <div className='row '>
        <div className='col-auto inside-align-title-col'>
          <h1 className='my-1 inside-align-title ms-3'>
            {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
          </h1>
        </div>
        <div className='col-auto schedule-lesson-border schedule-lesson-border-widthss'>
          <p className='m-2 time-style'>
            <div className='time-style'>{duration} Minutes</div>
          </p>
        </div>
        <div className='col-auto schedule-lesson-border lessons-remain '>
          <p className='m-2 Lesson-styles'>
            <div className='Lesson-styles'>{remaining} Lessons Remaining</div>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default LessonCard
