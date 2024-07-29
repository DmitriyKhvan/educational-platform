import { addWeeks, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useSchedule } from '@/pages/students/schedule-lesson/schedule-selector/schedule-provider';

import { Days } from '@/pages/students/schedule-lesson/schedule-selector/days';
import { TimesOfDay } from '@/pages/students/schedule-lesson/schedule-selector/times-of-day/times-of-day';

import { IoArrowBack } from 'react-icons/io5';

import Button from '@/components/form/button';
import { localeDic } from '@/shared/constants/global';
import type { Lesson } from '@/types/types.generated';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export const ScheduleSelector = ({
  lesson,
}: {
  lesson: Lesson;
}) => {
  const { setTabIndex, resetAll, todayUserTimezone, userTimezone } = useSchedule();

  const [t, i18n] = useTranslation(['lessons', 'common', 'modals', 'availability']);

  const currentLanguage = i18n.language;

  const [counter, setCounter] = useState(0);

  const today = addWeeks(todayUserTimezone, counter);

  // Start of ISO week
  const startOfWeek = startOfISOWeek(today);

  // End of ISO week
  const endOfWeek = endOfISOWeek(today);

  const startOfWeekFormatted = format(startOfWeek, 'MMM d', {
    timeZone: userTimezone,
    locale: localeDic[currentLanguage as keyof typeof localeDic],
  });

  const endOfWeekFormatted = format(endOfWeek, 'MMM d', {
    timeZone: userTimezone,
    locale: localeDic[currentLanguage as keyof typeof localeDic],
  });

  useEffect(() => {
    resetAll();
  }, []);

  return (
    <div className="max-w-[488px] m-auto">
      <div className="space-y-10">
        <div>
          <div className="flex items-center gap-3">
            {!lesson && (
              <button
                onClick={() => {
                  setTabIndex(0);
                  resetAll();
                }}
              >
                <IoArrowBack className="text-2xl" />
              </button>
            )}

            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold">
              {lesson ? t('reschedule_lesson', { ns: 'modals' }) : t('schedule_lesson')}
            </h1>
          </div>

          <p className="text-sm text-color-light-grey mt-[15px]">
            {lesson ? (
              <>
                {t('currently_scheduled', { ns: 'modals' })}{' '}
                {format(
                  toZonedTime(new Date(lesson.startAt), userTimezone),
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
            1. {t('choose_week', { ns: 'availability' })}
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
