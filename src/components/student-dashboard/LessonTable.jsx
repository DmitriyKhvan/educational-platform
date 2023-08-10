import React from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';

export const LessonTable = ({
  displayTableData,
  userTimezone,
  handleOpenFeedbackModal,
  // handleFeedback,
}) => {
  const [t] = useTranslation(['lessons']);

  const tableHead = [
    t('lesson_package', { ns: 'lessons' }),
    t('duration', { ns: 'lessons' }),
    t('date_time', { ns: 'lessons' }),
    t('mentor', { ns: 'lessons' }),
    t('status', { ns: 'lessons' }),
    // t('class_feedback', { ns: 'lessons' }),
  ];

  return (
    <>
      <table className="table mt-4">
        <thead>
          <tr>
            {tableHead.map((x, ind) => (
              <th scope="col" key={`row-${ind}`}>
                {x}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData?.length === 0 && (
            <tr>
              <td colSpan="5" align="center">
                <span onClick={handleOpenFeedbackModal}>
                  {t('no_lessons', { ns: 'lessons' })}
                </span>
              </td>
            </tr>
          )}
          {displayTableData
            .sort(
              (a, b) => new Date(a.dateTime.date) - new Date(b.dateTime.date),
            )
            .sort(
              (a, b) =>
                new Date(a.dateTime.startTime) - new Date(b.dateTime.startTime),
            )
            .map((event) => {
              return (
                <tr className="tr-center" key={event.resource.id}>
                  <td className="td-item">
                    <p className="td-lesson">
                      {event.resource.packageSubscription.package.course.title}
                    </p>
                  </td>
                  <td className="td-item">
                    <p className="td-lesson">{event.resource.duration} min</p>
                  </td>

                  {/* Do not remove this code, it will be used in the future 
                      <td className='td-item'>
                        <p className='td-topic-level'>
                          {event.level}
                        </p>
                      </td>
                      <td className='td-item'>
                        <p className='td-topic-level'>
                          {` ${event.currentTopic}`}
                        </p>
                      </td>
                      <td className='td-item'>
                        <p className='td-topic-level'>
                          {` ${event.nextTopic}`}
                        </p>
                      </td> */}
                  <td className="td-item">
                    <p className="td-datetime td-datetime-border ps-3">
                      {moment(event.resource.startAt)
                        .tz(userTimezone)
                        .format('ddd, MMM Do | hh:mm A')}
                      {' → '}
                      {moment(event.resource.startAt)
                        .tz(userTimezone)
                        .add(event.resource.duration, 'minutes')
                        .format('hh:mm A')}
                    </p>
                  </td>
                  <td className="td-item">
                    <p className="td-topic-level">
                      {event.resource.mentor.user.fullName}
                    </p>
                  </td>

                  <td className="td-item m-0">
                    <p className="td-topic-level">
                      {event.resource.status === 'approved'
                        ? 'Approved'
                        : event.resource.status === 'scheduled'
                        ? 'Peding Request'
                        : event.resource.status}
                    </p>
                  </td>

                  {/* <td className="td-item">
                    <button
                      className={`btn ${
                        event.tutorFeedback?.length
                          ? 'btn-primary'
                          : 'btn-tutor-feedback-disabled'
                      }`}
                      onClick={handleFeedback}
                    >
                      Feedback
                    </button>
                  </td> */}
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
};
