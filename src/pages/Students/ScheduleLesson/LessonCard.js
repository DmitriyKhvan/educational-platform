import React from 'react'

const LessonCard = ({ lesson, duration, remaining }) => (
  <div
    className={'time-card schedule-lesson-border bg-white small-card pt-2 mt-2'}
  >
    <div className='container-fluid py-3'>
      <div className='row mt-2'>
        <div className='col-auto'>
          <h1 className='text-black my-1'>
            {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
          </h1>
        </div>
        <div
          className='col-auto schedule-lesson-border mx-3 px-2 text-purple'
          style={{ background: '#EBE4FF' }}
        >
          <p className='m-2' style={{ textAlign: 'center' }}>
            <strong>{duration} Minutes</strong>
          </p>
        </div>
        <div className='col-auto schedule-lesson-border ms-2 px-2'>
          <p className='m-2' style={{ textAlign: 'center' }}>
            <strong>{remaining} Lessons Remaining</strong>
          </p>
        </div>
      </div>
    </div>
  </div>
)

export default LessonCard
