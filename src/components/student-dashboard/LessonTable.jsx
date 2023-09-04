import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { addMinutes } from 'date-fns';

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
              <th className='py-5 lg:first:pl-16' scope="col" key={`row-${ind}`}>
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
              (a, b) =>
                new Date(a.resource.startAt) - new Date(b.resource.startAt),
            )
            .map((event) => {
              return (
                <tr className="h-[80px] m-auto text-center" key={event.resource.id}>
                  <td className="pt-4 border-b text-left lg:pl-16">
                    <p className="mt-4 font-semibold text-color-light-grey tracking-tight text-[15px] leading-normal">
                      {event.resource.packageSubscription.package.course.title}
                    </p>
                  </td>
                  <td className="pt-4 border-b text-left">
                    <p className="mt-4 font-semibold text-color-light-grey tracking-tight text-[15px] leading-normal">{event.resource.duration} min</p>
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
                  <td className="py-[25px] border-b text-left">
                    <span className="border inline-block border-color-border-grey rounded-[10px] pr-2.5 pl-[15px] text-color-light-grey font-medium text-[15px] h-10 border-box leading-10">
                      <span className='h-full inline-block border-r border-color-border-grey pr-2.5 mr-2.5'>
                      {
                        format(
                          utcToZonedTime(new Date(event.resource.startAt), userTimezone), 'eee, MMM do'
                        )
                      }
                      </span>
                      <span className='inline-block'>
                      {
                        format(
                          utcToZonedTime(new Date(event.resource.startAt), userTimezone), 'hh:mm a'
                        )
                      }
                      {' → '}
                      {
                        format(
                          addMinutes(utcToZonedTime(new Date(event.resource.startAt), userTimezone), event.resource.duration),
                          'hh:mm a',
                          { timeZone: userTimezone }
                        )
                      }
                      </span>
                    </span>
                  </td>
                  <td className="pt-4 border-b text-left">
                    <p className="mt-4 text-color-light-grey tracking-tight text-[15px] leading-normal">
                      {event.resource.mentor.user.fullName}
                    </p>
                  </td>

                  <td className="pt-4 border-b m-0 text-left">
                    <p className="mt-4 text-color-light-grey tracking-tight text-[15px] leading-normal">
                      {event.resource.status === 'approved'
                        ? 'Approved'
                        : event.resource.status === 'scheduled'
                        ? 'Pending Approval'
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
