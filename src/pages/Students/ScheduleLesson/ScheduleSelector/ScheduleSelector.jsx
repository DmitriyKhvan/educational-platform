import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { addWeeks, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';

import { useSchedule } from './ScheduleProvider';

import { Days } from './Days';
import { TimesOfDay } from './TimesOfDay';

import { IoArrowBack } from 'react-icons/io5';

import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import Button from 'src/components/Form/Button';

export const ScheduleSelector = ({ lesson }) => {
  const { setTabIndex, resetAll, todayUserTimezone, userTimezone } =
    useSchedule();

  const [t, i18n] = useTranslation(['lessons', 'common', 'modals']);

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : null;

  const [counter, setCounter] = useState(0);

  const today = addWeeks(todayUserTimezone, counter);

  // Start of ISO week
  const startOfWeek = startOfISOWeek(today);

  // End of ISO week
  const endOfWeek = endOfISOWeek(today);

  const startOfWeekFormatted = format(startOfWeek, 'MMM d', {
    timeZone: userTimezone,
    locale: locale,
  });

  const endOfWeekFormatted = format(endOfWeek, 'MMM d', {
    timeZone: userTimezone,
    locale: locale,
  });

  useEffect(() => {
    resetAll();
  }, []);

  return (
    <div className="max-w-[488px] m-auto">
      <div className="space-y-10">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setTabIndex(0);
                resetAll();
              }}
            >
              <IoArrowBack className="text-2xl" />
            </button>

            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
              {lesson
                ? t('reschedule_lesson', { ns: 'modals' })
                : t('schedule_lesson')}
            </h1>
          </div>

          <p className="text-sm text-color-light-grey mt-[15px]">
            {lesson ? (
              <>
                {t('currently_scheduled', { ns: 'modals' })}{' '}
                {format(
                  utcToZonedTime(new Date(lesson.startAt), userTimezone),
                  'eeee, MMM dd hh:mm a',
                  {
                    timeZone: userTimezone,
                  },
                )}
              </>
            ) : (
              t('schedule_lesson_subtitle')
            )}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-[15px] text-color-dark-purple mb-4">
            1. Choose a week
          </h4>
          <div className="flex gap-3 w-full items-center justify-between mb-4">
            <Button
              theme="outline"
              className="h-[50px] px-[17px] "
              disabled={counter === 0}
              onClick={() => {
                resetAll();
                setCounter(counter - 1);
              }}
            >
              <IoIosArrowBack />
            </Button>

            <h1 className="flex grow items-center justify-center h-[50px] px-4 rounded-lg bg-color-light-grey2 text-sm font-medium">
              {startOfWeekFormatted} - {endOfWeekFormatted}
            </h1>

            <Button
              theme="outline"
              className="h-[50px] px-[17px] "
              onClick={() => {
                resetAll();
                setCounter(counter + 1);
              }}
              disabled={counter === 4}
            >
              <IoIosArrowForward />
            </Button>
          </div>
        </div>

        <Days startOfWeek={startOfWeek} counter={counter} />

        <TimesOfDay />
      </div>
    </div>
  );
};
