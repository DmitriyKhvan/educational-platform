import React from 'react';

const LessonCard = ({ lesson, duration, remaining }) => {
  const lessonTitle = lesson?.charAt(0).toUpperCase() + lesson?.slice(1);
  const lessonDuration = `${duration}`;
  const optionalDisplayLessons = remaining ? (
    <div className="col-auto schedule-lesson-border lessons-remain p-2">
      <div className="Lesson-styles">{remaining}</div>
    </div>
  ) : (
    ''
  );
  return (
    <div
      className={
        'time-card shadow-lg border schedule-lesson-border schedule-lesson-border-width bg-grey-100 small-card schedule_change_padd'
      }
    >
      <div className="ms-2">
        <div className="col-auto inside-align-title-col">
          <h1 className="my-1 inside-align-title">{lessonTitle}</h1>
        </div>
        <div className="row mt-3">
          <div className="col-auto rounded-lg schedule-lesson-border schedule-lesson-border-widthss">
            <p className="m-2 time-style">
              <div className="time-style">{lessonDuration}</div>
            </p>
          </div>
          {optionalDisplayLessons}
        </div>
      </div>
    </div>
  );
};

export default LessonCard;
