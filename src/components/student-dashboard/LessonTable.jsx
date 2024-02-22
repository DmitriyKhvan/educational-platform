import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import { addMinutes } from 'date-fns';

import { BsPlayCircle } from 'react-icons/bs';
import { ZoomRecordingModal } from '../ZoomRecordingModal';
import { LessonsStatusType } from 'src/constants/global';
import { MyDialog } from '../Dialog';

export const LessonTable = ({
  displayTableData,
  userTimezone,
  handleOpenFeedbackModal,
  // handleFeedback,
}) => {
  const { t, i18n } = useTranslation(['lessons', 'common']);

  const currentLanguage = i18n.language;

  const locale = currentLanguage === 'kr' ? kr : null;

  const tableHead = [
    t('lesson_package', { ns: 'lessons' }),
    t('duration', { ns: 'lessons' }),
    t('date_time', { ns: 'lessons' }),
    t('mentor', { ns: 'lessons' }),
    t('status', { ns: 'lessons' }),
    t('recording', { ns: 'lessons' }),
    // t('class_feedback', { ns: 'lessons' }),
  ];

  return (
    <>
      <table className="table border-spacing-2">
        <thead>
          <tr>
            {tableHead.map((x, ind) => (
              <th
                className="p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle text-sm lg:text-[15px] whitespace-nowrap"
                scope="col"
                key={`row-${ind}`}
              >
                {x}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData?.length === 0 && (
            <tr>
              <td colSpan={tableHead.length} align="center">
                <span onClick={handleOpenFeedbackModal}>
                  {t('no_lessons', { ns: 'lessons' })}
                </span>
              </td>
            </tr>
          )}
          {displayTableData.map((event) => {
            return (
              <tr className="" key={event.resource.id}>
                <td className="border-b p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="text-xs lg:text-[15px] font-semibold text-color-light-grey tracking-tight text-[15px] leading-normal">
                    {event.resource.packageSubscription.package.course.title}
                  </p>
                </td>
                <td className="border-b p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="text-xs lg:text-[15px] font-semibold text-color-light-grey tracking-tight text-[15px] leading-normal">
                    {event.resource.duration} {t('minutes', { ns: 'common' })}
                  </p>
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
                <td className="border-b p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <span className="text-xs lg:text-[15px] border inline-block border-color-border-grey rounded-[10px] px-2 lg:px-4 text-color-light-grey font-medium text-[15px] h-10 border-box leading-10 whitespace-nowrap">
                    <span className="h-full inline-block border-r border-color-border-grey pr-2.5 mr-2.5">
                      {format(
                        utcToZonedTime(
                          new Date(event.resource.startAt),
                          userTimezone,
                        ),
                        'eee, MMM do',
                        { timeZone: userTimezone, locale: locale },
                      )}
                    </span>
                    <span className="inline-block">
                      {format(
                        utcToZonedTime(
                          new Date(event.resource.startAt),
                          userTimezone,
                        ),
                        'hh:mm a',
                        { timeZone: userTimezone, locale: locale },
                      )}
                      {' → '}
                      {format(
                        addMinutes(
                          utcToZonedTime(
                            new Date(event.resource.startAt),
                            userTimezone,
                          ),
                          event.resource.duration,
                        ),
                        'hh:mm a',
                        { timeZone: userTimezone, locale: locale },
                      )}
                    </span>
                  </span>
                </td>
                <td className="border-b p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="text-xs lg:text-[15px] text-color-light-grey tracking-tight text-[15px] leading-normal">
                    {event.resource.mentor.firstName}{' '}
                    {event.resource.mentor.lastName}
                  </p>
                </td>

                <td className="border-b p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="text-xs lg:text-[15px] text-color-light-grey tracking-tight text-[15px] leading-normal">
                    {event.resource.status === LessonsStatusType.SCHEDULED ||
                    event.resource.status === LessonsStatusType.RESCHEDULED
                      ? t('lesson_pending_approval')
                      : t(event.resource.status)}
                  </p>
                </td>
                <td className="border-b p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  {event.resource?.zoom?.recordingUrl && (
                    <MyDialog
                      button={
                        <BsPlayCircle className="text-2xl text-color-purple cursor-pointer text-center" />
                      }
                    >
                      <ZoomRecordingModal
                        urlRecording={event.resource?.zoom?.recordingUrl}
                        width="70vw"
                      />
                    </MyDialog>
                  )}
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
