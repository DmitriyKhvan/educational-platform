import React from 'react';

const LessonCard = ({ lesson, duration, remaining }) => {
  const lessonTitle = lesson?.charAt(0).toUpperCase() + lesson?.slice(1);
  const lessonDuration = `${duration}`;
  const optionalDisplayLessons = remaining ? (
    <div className="col-auto schedule-lesson-border lessons-remain border rounded-lg py-1.5 px-2">
      <div className="Lesson-styles">{remaining}</div>
    </div>
  ) : (
    ''
  );
  return (
    <div
      className={
        'time-card border border-gray-200 schedule-lesson-border schedule-lesson-border-width bg-grey-100 small-card schedule_change_padd'
      }
    >
      <div className="ms-2">
        <div className="col-auto inside-align-title-col">
          <h1 className="my-1 inside-align-title">{lessonTitle || 'Title'}</h1>
        </div>
        <div className="flex mt-3 gap-2 items-center">
          <div className="col-auto rounded-lg schedule-lesson-border schedule-lesson-border-widthss h-full">
            <p className="m-2 time-style flex items-center justify-center">
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
