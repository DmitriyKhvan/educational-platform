import {
  addHours,
  addMinutes,
  getMinutes,
  isBefore,
  parse,
  subHours,
} from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { cn } from 'src/utils/functions';
import Swal from 'sweetalert2';
import { useSchedule } from '../ScheduleProvider';

export const ScheduleCard = ({ scheduleStartTime, setIsLoading }) => {
  const { setTabIndex, setSchedule, duration, day, todayUserTimezone } =
    useSchedule();
  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [t, i18n] = useTranslation(['lessons', 'common', 'modals']);

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : null;

  const dayFormat = format(new Date(day), 'EEEE, MMM dd', {
    locale: locale,
  });

  const scheduleStartTimeParse = parse(
    scheduleStartTime.time,
    'HH:mm',
    new Date(),
  );

  const scheduleStartTimeFormat = format(scheduleStartTimeParse, 'hh:mm a');

  const scheduleEndTimeFormat = format(
    addMinutes(scheduleStartTimeParse, duration),
    'hh:mm a',
  );

  const handleConfirmLesson = (scheduleStartTime) => {
    if (scheduleStartTime.reserved) {
      return;
    }

    const formattedDay = format(new Date(day), 'yyyy-MM-dd');

    const dateParse = parse(
      `${formattedDay} ${scheduleStartTime.time}`,
      'yyyy-MM-dd HH:mm',
      utcToZonedTime(new Date(), userTimezone),
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
      setIsLoading(true);
      setSchedule(selectedSchedule.toString());
      setTabIndex(2);
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        `time-card space-y-2 grey-border bg-white small-card pt-4 media_align_width`,
        scheduleStartTime.reserved &&
          'bg-color-darker-grey grayscale-[70%] opacity-50',
      )}
    >
      <div className="row container ms-1">
        <div className="col-12 align_schedule_texts">
          <h3 className="text-color-dark-purple text-base sm:text-lg">
            {`${scheduleStartTimeFormat} → ${scheduleEndTimeFormat}`}
          </h3>
        </div>
      </div>
      <div className="row final_width_change">
        <div className="col">
          <div className="schedule-card-col">
            <p className={`enter-btn time-btn grey-border text-black`}>
              {dayFormat}
            </p>
          </div>
        </div>
        <div className="col">
          <div className="schedule-card-col">
            <div
              className={cn(
                `enter-btn bg-color-purple text-white align_button_sche_lesson`,
                scheduleStartTime.reserved && 'cursor-no-drop',
              )}
              onClick={() => {
                handleConfirmLesson(scheduleStartTime);
              }}
            >
              {t('booking_lesson')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
