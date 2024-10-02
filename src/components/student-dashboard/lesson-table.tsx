import { addMinutes } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@/app/providers/auth-provider';
import LessonControls from '@/components/student-dashboard/lesson-controls';
import StatusIndicator from '@/components/student-dashboard/status-indicator';
import { Roles } from '@/shared/constants/global';
import { cn } from '@/shared/utils/functions';
import { getTranslatedTitle } from '@/shared/utils/get-translated-title';
import type { CalendarEventsSorted } from '@/types';
import type { Lesson } from '@/types/types.generated';
import { Avatar } from '@/widgets/avatar/avatar';
import { buttonizeA11Y } from '@/shared/utils/buttonizeA11Y';

interface LessonTableProps {
  displayTableData: CalendarEventsSorted[];
  getAppointments: () => void;
  userTimezone: string;
  handleOpenFeedbackModal?: () => void;
  handleFeedback?: () => void;
}

const LessonTable: React.FC<LessonTableProps> = ({
  displayTableData,
  getAppointments,
  userTimezone,
  handleOpenFeedbackModal,
}) => {
  const { t, i18n } = useTranslation(['lessons', 'common']);
  const { user, currentStudent } = useAuth();

  const currentLanguage = i18n.language;

  const locale = currentLanguage === 'kr' ? kr : undefined;

  const tableHead = [
    t('status', { ns: 'lessons' }),
    t('date', { ns: 'lessons' }),
    t('time', { ns: 'lessons' }),
    t('lesson_package', { ns: 'lessons' }),
    user?.role === Roles.MENTOR ? t('student', { ns: 'lessons' }) : t('mentor', { ns: 'lessons' }),
    t('duration', { ns: 'lessons' }),
    t('level', { ns: 'lessons' }),
    '',
  ];

  return (
    <>
      <table className="border border-separate border-spacing-0 border-gray-100 drop-shadow-sm w-full rounded-2xl">
        <thead className="w-full">
          <tr className="">
            {tableHead.map((title) => (
              <th
                className="first:pl-5 last:pr-5 border-b group-last:border-b-0 h-[57px] text-gray-300 font-normal p-1 align-middle text-sm lg:text-[15px] whitespace-nowrap"
                scope="col"
                key={title}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {displayTableData.length === 0 && (
            <tr>
              <td colSpan={tableHead.length} align="center">
                <span {...buttonizeA11Y(handleOpenFeedbackModal)}>
                  {t('no_lessons', { ns: 'lessons' })}
                </span>
              </td>
            </tr>
          )}
          {displayTableData.map((event) => {
            const data = event.resource as Lesson;
            const date = new Date(data.startAt ?? new Date());

            const userToDisplay = user?.role === Roles.MENTOR ? data.student : data.mentor;
            const duration = Number(data.duration) ?? 0;

            return (
              <tr key={data.id} className="group">
                <td className="p-1 pl-5 border-b group-last:border-b-0 h-[80px] align-middle">
                  <StatusIndicator status={data.status} />
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] font-medium text-color-dark-purple p-1 align-middle">
                  {format(toZonedTime(new Date(data.startAt), userTimezone), 'eee, MMM do', {
                    timeZone: userTimezone,
                    locale: locale,
                  })}
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="font-medium text-color-dark-purple">
                    {format(toZonedTime(new Date(data.startAt), userTimezone), 'hh:mm a', {
                      timeZone: userTimezone,
                      locale: locale,
                    })}
                    {' - '}
                    {format(
                      addMinutes(toZonedTime(new Date(data.startAt), userTimezone), duration),
                      'hh:mm a',
                      { timeZone: userTimezone, locale: locale },
                    )}
                  </p>
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {getTranslatedTitle(data?.packageSubscription?.package?.course, i18n.language)}
                  </p>
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle flex items-center">
                  <Avatar
                    avatarUrl={userToDisplay?.avatar?.url}
                    fallback={user?.role === Roles.MENTOR ? 'duck' : 'user'}
                    className={cn(
                      'w-9 h-9 rounded-full overflow-hidden mr-3 min-h-9 min-w-9',
                      user?.role === Roles.MENTOR && 'bg-color-purple',
                    )}
                  />
                  <p className="text-sm lg:text-[15px] max-w-32 font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal truncate">
                    {userToDisplay?.firstName}
                    {userToDisplay?.lastName ? ` ${userToDisplay?.lastName[0]}.` : ''}
                  </p>
                </td>
                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {duration} {t('minutes', { ns: 'common' })}
                  </p>
                </td>

                <td className="border-b group-last:border-b-0 h-[80px] p-1 align-middle">
                  <p className="text-sm lg:text-[15px] font-medium text-color-dark-purple tracking-tight text-[15px] leading-normal">
                    {getTranslatedTitle(data?.languageLevel, i18n.language) ??
                      getTranslatedTitle(data?.student?.languageLevel, i18n.language) ??
                      getTranslatedTitle(currentStudent?.languageLevel, i18n.language) ??
                      data?.student?.langLevel ??
                      ''}
                  </p>
                </td>

                <td className="pr-5 border-b group-last:border-b-0 h-[80px] align-middle">
                  <LessonControls
                    date={date}
                    data={data}
                    refetch={getAppointments}
                    duration={duration}
                    pattern="table"
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

export default LessonTable;
