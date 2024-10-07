import { useAuth } from '@/app/providers/auth-provider';
import Button from '@/components/form/button';
import { localeDic } from '@/shared/constants/global';
import type { Lesson } from '@/types/types.generated';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle } from 'react-icons/fa';
import { FaCircleXmark } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import ScheduleSuccessCard from './schedule-success-card';

const ScheduleSuccess = ({
  lessons,
}: {
  lessons: Lesson[];
}) => {
  const { user } = useAuth();
  const [t, i18n] = useTranslation(['lessons', 'modals']);
  const navigate = useNavigate();

  const userTimezone =
    user?.timeZone?.split(' ')[0] || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const sortedByMonthsLessons = lessons.reduce(
    (acc, cur) => {
      const startAt = format(new Date(cur.startAt), 'MMMM');

      if (acc[startAt]) {
        acc[startAt].push(cur);
      } else {
        acc[startAt] = [cur];
      }
      return acc;
    },
    {} as { [key: string]: Lesson[] },
  );

  const displayZonedRangeDate = (month: string, lessons: Lesson[]) => {
    const formatAndZoneDate = (startAt: string) => {
      return format(toZonedTime(new Date(startAt), userTimezone), 'dd.MM', {
        locale: localeDic[i18n.language as keyof typeof localeDic],
      });
    };
    return `${month} ${formatAndZoneDate(lessons[0].startAt)} - ${formatAndZoneDate(lessons[lessons.length - 1].startAt)}`;
  };

  return (
    <div className="max-w-[488px] mx-auto">
      <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-8 sm:justify-center">
        {lessons?.find((l) => l.status) ? (
          <>
            <FaCheckCircle className="w-6 h-6 sm:w-9 sm:h-9 text-[#039855]" />
            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
              {t('lesson_approved')}
            </h1>
          </>
        ) : (
          <>
            <FaCircleXmark className="w-6 h-6 sm:w-9 sm:h-9 text-red-500" />
            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
              {t('lesson_scheduling_failed')}
            </h1>
          </>
        )}
      </div>

      {Object.entries(sortedByMonthsLessons).map((ls) => (
        <div key={ls[0]} className="mt-10 border-b pb-6">
          <div className="flex justify-between mb-6">
            <p className="text-xl font-bold">{displayZonedRangeDate(ls[0], ls[1])}</p>
            <p className="text-color-purple">{ls[1].filter((l) => l.status).length} lesson(s)</p>
          </div>
          {ls[1]?.map((l) => (
            <ScheduleSuccessCard
              key={l?.id}
              status={l?.status}
              data={l}
              date={l.startAt}
              duration={l.duration ?? 0}
            />
          ))}
        </div>
      ))}

      <Button
        className="w-full h-[57px] mb-3 mt-5"
        onClick={() => navigate('/student/lesson-calendar')}
      >
        {t('view_my_lessons')}
      </Button>
      <Button
        className="w-full h-[57px]"
        theme="gray"
        onClick={() => navigate('/student/manage-lessons')}
      >
        {t('return_to_dash')}
      </Button>
    </div>
  );
};

export default ScheduleSuccess;
