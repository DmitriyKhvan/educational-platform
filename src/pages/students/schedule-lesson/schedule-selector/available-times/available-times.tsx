import Button from '@/components/form/button';
import { ScheduleCard } from '@/pages/students/schedule-lesson/schedule-selector/available-times/schedule-card';
import { useSchedule } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';
import { addHours, addMinutes, getMinutes, isBefore, parse, subHours } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import Swal from 'sweetalert2';
import type { AvailableTime } from '../schedule-provider/lib/schedule-context';
import type { Mentor } from '@/types/types.generated';

export const AvailableTimes = memo(function AvailableTimes() {
  const {
    availableTimes,
    setTabIndex,
    setSchedule,
    todayUserTimezone,
    day,
    resetAll,
    setSelectMentor,
    userTimezone,
  } = useSchedule();
  const [t] = useTranslation(['lessons', 'common', 'modals']);

  const [scheduleStartTime, setScheduleStartTime] = useState<AvailableTime | null | undefined>();

  const handleConfirmLesson = () => {
    if (!scheduleStartTime || scheduleStartTime.reserved) {
      return;
    }

    if (setSelectMentor) {
      setSelectMentor({ id: scheduleStartTime?.mentorId } as Mentor);
    }

    const formattedDay = format(new Date(day), 'yyyy-MM-dd');

    const dateParse = parse(
      `${formattedDay} ${scheduleStartTime.time}`,
      'yyyy-MM-dd HH:mm',
      toZonedTime(new Date(), userTimezone),
    );

    const selectedSchedule = format(dateParse, 'EEE MMM dd yyyy HH:mm:ss XXX', {
      timeZone: userTimezone,
    });

    const hoursPrior = process.env.REACT_APP_PRODUCTION === 'true' ? 48 : 0;

    const preScreen = subHours(dateParse, hoursPrior);

    if (!isBefore(todayUserTimezone, preScreen)) {
      const minutesRound = 30 - (getMinutes(todayUserTimezone) % 30);

      const available = format(
        addHours(addMinutes(todayUserTimezone, minutesRound), hoursPrior),
        'eeee, MMMM dd @ h:mm a',
        { timeZone: userTimezone },
      );

      Swal.fire({
        title: t('swal_fire_title_schedule_prescreen', { ns: 'modals' }),
        text:
          process.env.REACT_APP_PRODUCTION === 'true'
            ? t('swal_fire_text_schedule_prescreen', { ns: 'modals' })
            : t('swal_fire_footer_schedule_prescreen', { ns: 'modals' }),
        icon: 'warning',
        width: '36em',
        confirmButtonColor: '#6133af',
        focusConfirm: true,
        footer: `*${t('swal_fire_footer_schedule_prescreen', {
          ns: 'modals',
        })} ${available}`,
      });
    }

    if (isBefore(todayUserTimezone, preScreen)) {
      setSchedule(selectedSchedule.toString());
      setTabIndex(3);
    }
  };

  return (
    <div className="max-w-[488px] m-auto">
      {availableTimes.length !== 0 && (
        <div className="space-y-10">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setTabIndex(1);
                  resetAll();
                }}
              >
                <IoArrowBack className="text-2xl" />
              </button>
              <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
                {t('available_spots')}
              </h1>
            </div>

            <p className="text-sm text-color-light-grey mt-[15px]">
              {t('available_spots_subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            {availableTimes.map((startTime) => (
              <ScheduleCard
                startTime={startTime}
                scheduleStartTime={scheduleStartTime}
                setScheduleStartTime={setScheduleStartTime}
                key={startTime.time}
              />
            ))}
          </div>
          <Button
            id="timeSheets"
            disabled={!scheduleStartTime}
            className="w-full"
            onClick={handleConfirmLesson}
          >
            {t('continue_button', { ns: 'common' })}
          </Button>
        </div>
      )}
    </div>
  );
});
