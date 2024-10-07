import { useAuth } from '@/app/providers/auth-provider';
import Indicator from '@/components/indicator';
import RescheduleAndCancelModal from '@/components/student-dashboard/reschedule-and-cancel-modal-rebranding';
import { ModalType, localeDic } from '@/shared/constants/global';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import { cn } from '@/shared/utils/functions';
import type { Lesson, LessonStatusType, Maybe } from '@/types/types.generated';
import { addMinutes } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HiTrash } from 'react-icons/hi';
import { MdOutlineEditCalendar } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface ScheduleSuccessCardProps {
  data?: Lesson;
  date?: string | Date;
  duration?: number;
  status?: Maybe<LessonStatusType>;
}

function ScheduleSuccessCard({ data, date, duration, status }: ScheduleSuccessCardProps) {
  const [t, i18n] = useTranslation(['modals', 'common', 'feedback']);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dateLesson = new Date(date ?? new Date());

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const displayDate = () => {
    const eventDate = format(toZonedTime(dateLesson, userTimezone), 'MMMM do', {
      timeZone: userTimezone,
      locale: localeDic[i18n.language as keyof typeof localeDic],
    });
    const start = format(toZonedTime(dateLesson, userTimezone), 'hh:mm a', {
      timeZone: userTimezone,
      locale: localeDic[i18n.language as keyof typeof localeDic],
    });

    const end = format(
      addMinutes(toZonedTime(dateLesson, userTimezone), duration ?? 0),
      'hh:mm a',
      { timeZone: userTimezone, locale: localeDic[i18n.language as keyof typeof localeDic] },
    );

    const weekDay = format(toZonedTime(dateLesson, userTimezone), 'EEEE', {
      timeZone: userTimezone,
      locale: localeDic[i18n.language as keyof typeof localeDic],
    });

    return (
      <div className="text-[30px] font-normal text-black m-0 flex flex-col items-start gap-3">
        <p className="font-semibold text-lg">
          {start} - {end}, {weekDay}
        </p>
        <p className="text-sm">{eventDate}</p>
      </div>
    );
  };

  const [tabIndex, setTabIndex] = useState(0);

  const rescheduleAndCancelModal = (modalType: ModalType) => (
    <RescheduleAndCancelModal
      data={data ?? { id: '' }}
      setTabIndex={setTabIndex}
      fetchAppointments={() => navigate('/student/lesson-calendar')}
      tabIndex={tabIndex}
      type={modalType}
      duration={duration ?? 0}
    />
  );

  return (
    <div
      className={cn(
        'w-full border rounded-lg flex justify-between items-center p-4 mb-5 shadow-[0px_0px_16px_0px_#0000000A]',
        !status && 'bg-color-grey3',
      )}
    >
      <div>{displayDate()}</div>

      {status ? (
        <div className="flex gap-3">
          <AdaptiveDialog
            button={
              <span className="flex justify-center items-center bg-[#F7F8FA] w-10 h-10 rounded-md hover:cursor-pointer">
                <MdOutlineEditCalendar className="w-6 h-6 text-color-dark-purple" />
              </span>
            }
          >
            {rescheduleAndCancelModal(ModalType.RESCHEDULE)}
          </AdaptiveDialog>

          <AdaptiveDialog
            button={
              <span className="flex justify-center items-center bg-[#F7F8FA] w-10 h-10 rounded-md hover:cursor-pointer">
                <HiTrash className="w-6 h-6 text-color-dark-purple" />
              </span>
            }
          >
            {rescheduleAndCancelModal(ModalType.CANCEL)}
          </AdaptiveDialog>
        </div>
      ) : (
        <Indicator className="bg-color-purple text-color-purple">
          {t(data?.cancelReason ?? '', { ns: 'modals' })}
        </Indicator>
      )}
    </div>
  );
}

export default ScheduleSuccessCard;
