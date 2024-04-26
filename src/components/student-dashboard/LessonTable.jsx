import React from 'react';
import { useTranslation } from 'react-i18next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import { addMinutes } from 'date-fns';

import StatusIndicator from './StatusIndicator';
import { Avatar } from 'src/widgets/Avatar/Avatar';
import LessonControls from './LessonControls';
import { useAuth } from 'src/modules/auth';
import { useCourseTranslation } from 'src/utils/useCourseTranslation';
import { Roles } from 'src/constants/global';

export const LessonTable = ({
  displayTableData,
  getAppointments,
  userTimezone,
  handleOpenFeedbackModal,
}) => {
  const { getTitleByCourseId } = useCourseTranslation();
  const { t, i18n } = useTranslation(['lessons', 'common']);
  const { user, currentStudent } = useAuth();

  const currentLanguage = i18n.language;

  const locale = currentLanguage === 'kr' ? kr : null;

  const tableHead = [
    t('status', { ns: 'lessons' }),
    t('date', { ns: 'lessons' }),
    t('time', { ns: 'lessons' }),
    t('lesson_package', { ns: 'lessons' }),
    user.role === Roles.MENTOR
      ? t('student', { ns: 'lessons' })
      : t('mentor', { ns: 'lessons' }),
    t('duration', { ns: 'lessons' }),
    t('level', { ns: 'lessons' }),
    '',
  ];

  return (
    <>
      <table className="border border-separate border-spacing-0 border-gray-100 drop-shadow-sm w-full rounded-2xl">
        <thead className="w-full">
          <tr className="">
            {tableHead?.map((x, ind) => (
              <th
                className="first:pl-5 last:pr-5 border-b group-last:border-b-0 h-[57px] text-gray-300 font-normal p-1 align-middle text-sm lg:text-[15px] whitespace-nowrap"
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
          {displayTableData?.map((event) => {
            const data = event?.resource;
            const date = new Date(data?.startAt ?? new Date());

            const userToDisplay =
              user.role === Roles.MENTOR ? data.student : data.mentor;

            return (
              <tr className="group" key={data.id}>
                <td className="p-1 pl-5 border-b group-last:border-b-0 h-[80px] align-middle">
                  <StatusIndicator status={data.status} />
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] font-medium text-color-dark-purple p-1 align-middle">
                  {format(
                    utcToZonedTime(new Date(data.startAt), userTimezone),
                    'eee, MMM do',
                    { timeZone: userTimezone, locale: locale },
                  )}
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="font-medium text-color-dark-purple">
                    {format(
                      utcToZonedTime(new Date(data.startAt), userTimezone),
                      'hh:mm a',
                      { timeZone: userTimezone, locale: locale },
                    )}
                    {' - '}
                    {format(
                      addMinutes(
                        utcToZonedTime(new Date(data.startAt), userTimezone),
                        data.duration,
                      ),
                      'hh:mm a',
                      { timeZone: userTimezone, locale: locale },
                    )}
                  </p>
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {getTitleByCourseId(
                      data.packageSubscription.package.course.id,
                    )}
                  </p>
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle flex items-center">
                  <Avatar
                    avatarUrl={userToDisplay?.avatar?.url}
                    className="w-9 h-9 rounded-full overflow-hidden mr-3 min-h-9 min-w-9"
                  />
                  <p className="text-sm lg:text-[15px] max-w-32 font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal truncate">
                    {userToDisplay.firstName}
                    {userToDisplay.lastName
                      ? ` ${userToDisplay.lastName[0]}.`
                      : ''}
                  </p>
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {data.duration} {t('minutes', { ns: 'common' })}
                  </p>
                </td>

                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {data?.student?.languageLevel?.title ??
                    data?.student?.langLevel ??
                    user.role === Roles.STUDENT
                      ? currentStudent?.languageLevel?.title
                      : undefined}
                  </p>
                </td>

                <td className="pr-5 border-b group-last:border-b-0 h-[80px] align-middle">
                  <LessonControls
                    date={date}
                    data={data}
                    playground={data?.playground}
                    refetch={getAppointments}
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
