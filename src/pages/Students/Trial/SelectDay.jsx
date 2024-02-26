import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import Button from 'src/components/Form/Button';
import { Days } from '../ScheduleLesson/ScheduleSelector/Days';
import { TimesOfDay } from '../ScheduleLesson/ScheduleSelector/TimesOfDay';
import { addWeeks, endOfISOWeek, format, startOfISOWeek } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useSchedule } from '../ScheduleLesson/ScheduleSelector/ScheduleProvider';
import { useAuth } from 'src/modules/auth';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { ko as kr } from 'date-fns/locale';
// import { ScheduleSelector } from '../ScheduleLesson/ScheduleSelector';
// import { LESSON_QUERY } from 'src/modules/auth/graphql';
// import { useQuery } from '@apollo/client';

const SelectDay = ({ setStep }) => {
  const { resetAll, todayUserTimezone } = useSchedule();
  const [t, i18n] = useTranslation(['lessons', 'common', 'modals']);

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : null;

  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

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

  return (
    <div className="w-full max-w-[440px] mx-auto">
      <div className="mb-8 flex flex-col justify-center">
        <div className="flex items-center">
          <FaArrowLeft
            className="mr-3 w-[20px] h-[20px] cursor-pointer"
            onClick={() => setStep((v) => v - 1)}
          />{' '}
          {/* <h1 className="text-3xl font-semibold">Select a Day</h1> */}
          <h1 className="text-3x sm:text-4xl text-color-dark-purple font-bold">
            {t('schedule_lesson')}
          </h1>
        </div>
        {/* <ScheduleSelector lesson={null} /> */}
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
        {/* <ScheduleProvider
        setTabIndex={setTabIndex}
        setSchedule={setSchedule}
        selectedMentor={location?.state?.tutor}
        duration={selectedPlan?.package?.sessionTime}
      >
        {tabIndex === 1 && <ScheduleSelector lesson={scheduledLesson} />}

        {tabIndex === 2 && <AvailableTimes />}
      </ScheduleProvider> */}
      </div>

      <Button
        className="w-full h-14 sm:h-16"
        onClick={() => setStep((v) => v + 1)}
      >
        Continue
      </Button>
    </div>
  );
};

export default SelectDay;
