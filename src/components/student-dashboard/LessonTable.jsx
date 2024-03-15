import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import { addMinutes } from 'date-fns';

import StatusIndicator from './StatusIndicator';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import LessonControls from './LessonControls';
import { useAuth } from 'src/modules/auth';

export const LessonTable = ({
  displayTableData,
  userTimezone,
  handleOpenFeedbackModal,
}) => {
  const { t, i18n } = useTranslation(['lessons', 'common']);
  const { currentStudent } = useAuth();

  const currentLanguage = i18n.language;

  const locale = currentLanguage === 'kr' ? kr : null;

  const tableHead = [
    t('status', { ns: 'lessons' }),
    t('date', { ns: 'lessons' }),
    t('time', { ns: 'lessons' }),
    t('lesson_package', { ns: 'lessons' }),
    t('mentor', { ns: 'lessons' }),
    t('duration', { ns: 'lessons' }),
    t('level', { ns: 'lessons' }),
    '',
    // t('recording', { ns: 'lessons' }),
    // t('class_feedback', { ns: 'lessons' }),
  ];

  return (
    <>
      <table className="border border-separate border-spacing-0 border-gray-100 drop-shadow-sm w-full rounded-2xl">
        <thead className="w-full">
          <tr className="">
            {tableHead.map((x, ind) => (
              <th
                className="first:pl-5 last:pr-5 border-b text-gray-300 font-normal p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle text-sm lg:text-[15px] whitespace-nowrap"
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
            const data = event?.resource;
            const date = new Date(data?.startAt ?? new Date());

            return (
              <tr className="group" key={event.resource.id}>
                <td className="p-1 pl-5 border-b group-last:border-none align-middle">
                  <StatusIndicator status={event.resource.status} />
                </td>
                <td className="border-b group-last:border-none font-medium text-color-dark-purple p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  {format(
                    utcToZonedTime(
                      new Date(event.resource.startAt),
                      userTimezone,
                    ),
                    'eee, MMM do',
                    { timeZone: userTimezone, locale: locale },
                  )}
                </td>
                <td className="border-b group-last:border-none p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="font-medium text-color-dark-purple">
                    {format(
                      utcToZonedTime(
                        new Date(event.resource.startAt),
                        userTimezone,
                      ),
                      'hh:mm a',
                      { timeZone: userTimezone, locale: locale },
                    )}
                    {' - '}
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
                  </p>
                </td>
                <td className="border-b group-last:border-none p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {event.resource.packageSubscription.package.course.title}
                  </p>
                </td>
                <td className="border-b group-last:border-none p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle flex items-center">
                  <Avatar
                    avatarUrl={event?.resource?.mentor?.avatar?.url}
                    className="w-9 h-9 rounded-full overflow-hidden mr-3 min-h-9 min-w-9"
                  />
                  <p className="text-sm lg:text-[15px] max-w-32 font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal truncate">
                    {event.resource.mentor.firstName}
                    {event.resource.mentor.lastName
                      ? ` ${event.resource.mentor.lastName[0]}.`
                      : ''}
                  </p>
                </td>
                <td className="border-b group-last:border-none p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {event.resource.duration} {t('minutes', { ns: 'common' })}
                  </p>
                </td>

                <td className="border-b group-last:border-none p-1 lg:px-3 lg:py-2 xl:px-2 xl:py-4 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {currentStudent.langLevel}
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
                <td className="pr-5 border-b group-last:border-none align-middle">
                  <LessonControls
                    date={date}
                    data={data}
                    zoom={data?.zoom}
                    mentor={data?.mentor}
                    lesson={data?.packageSubscription?.package?.course?.title}
                    duration={data.duration}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
