import React from 'react'

const LessonCard = ({ lesson, duration, remaining }) => (
  <div
    className={
      'time-card schedule-lesson-border schedule-lesson-border-width  bg-white small-card pt-2 mt-2'
    }
  >
    <div className='container-fluid containers-fluids'>
      <div className='row mt-2'>
        <div className='col-auto inside-align-title-col'>
          <h1 className='my-1 inside-align-title'>
            {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
          </h1>
        </div>
        <div className='col-auto schedule-lesson-border schedule-lesson-border-widthss mx-1 px-2'>
          <p className='m-2 time-style'>
            <div className='time-style'>{duration} Minutes</div>
          </p>
        </div>
        <div className='col-auto schedule-lesson-border lessons-remain ms-2 px-2 '>
          <p className='m-2 Lesson-styles'>
            <div className='Lesson-styles'>{remaining} Lessons Remaining</div>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default LessonCard
