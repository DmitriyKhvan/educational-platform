import { addMinutes, isBefore, parse, subHours } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';
import { cn } from 'src/utils/functions';
import Swal from 'sweetalert2';

export const ScheduleCard = ({
  scheduleStartTime,
  day,
  duration,
  setIsLoading,
  setSchedule,
  setTabIndex,
}) => {
  console.log('day', day);
  console.log('scheduleStartTime', scheduleStartTime);

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
    // const formattedDay = moment(day).format('YYYY-MM-DD');
    // const selectedSchedule = moment.tz(
    //   formattedDay + ' ' + scheduleStartTime.time,
    //   userTimezone,
    // );

    const formattedDay = format(new Date(day), 'yyyy-MM-dd');

    const dateParse = parse(
      `${formattedDay} ${scheduleStartTime.time}`,
      'yyyy-MM-dd HH:mm',
      utcToZonedTime(new Date(), userTimezone),
    );

    const selectedSchedule = format(dateParse, 'EEE MMM dd yyyy HH:mm:ss XXX', {
      timeZone: userTimezone,
    });

    // const hoursPrior = process.env.REACT_APP_PRODUCTION === 'true' ? 48 : 0;
    const hoursPrior = 48;

    // const preScreen = moment
    //   .tz(formattedDay + ' ' + scheduleStartTime.time, userTimezone)
    //   .subtract(hoursPrior, 'hours');

    const preScreen = subHours(dateParse, hoursPrior);

    console.log('preScreen', preScreen);
    console.log(utcToZonedTime(new Date(), userTimezone));

    const todayDate = moment();

    if (!isBefore(utcToZonedTime(new Date(), userTimezone), preScreen)) {
      const minutesRound = 30 - (todayDate.minute() % 30);

      console.log('minutesRound', minutesRound);

      const available = moment
        .tz(userTimezone)
        .add(hoursPrior, 'hours')
        .add(minutesRound, 'minutes')
        .format('dddd[,] MMMM DD @ h:mm A');

      // const minutesRound =
      //   30 - (utcToZonedTime(new Date(), userTimezone).getMinutes() % 30);

      // const todayStart = startOfDay(todayDate);
      // const roundedTime = addMinutes(startOfHour(todayStart), minutesRound);

      // const available = format(
      //   utcToZonedTime(addHours(roundedTime, hoursPrior), userTimezone),
      //   'eeee, MMMM dd @ h:mm a',
      //   { timeZone: userTimezone },
      // );

      console.log('available', available);

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

    if (todayDate.isBefore(preScreen)) {
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
