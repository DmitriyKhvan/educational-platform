import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addWeeks, endOfISOWeek, startOfISOWeek } from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';

import { useAuth } from '../../../../modules/auth';
import { useSchedule } from './ScheduleProvider';

import { AvailableTimes } from './AvailableTimes';
import { Days } from './Days';
import { TimesOfDay } from './TimesOfDay';
import Layout from '../../../../components/Layout';
import Loader from 'react-loader-spinner';

import custom_back_arrow from 'src/assets/images/custom_back_arrow.svg';
import forward_arrow from 'src/assets/images/forward_arrow.svg';

export const ScheduleSelector = ({ lesson }) => {
  const { setTabIndex, resetAll, todayUserTimezone } = useSchedule();
  const [t, i18n] = useTranslation(['lessons', 'common', 'modals']);

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : null;

  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);

  const today = addWeeks(todayUserTimezone, counter);

  // Start of ISO week
  const startOfWeek = startOfISOWeek(today);

  // End of ISO week
  const endOfWeek = endOfISOWeek(today);

  const startOfWeekFormatted = format(startOfWeek, 'MMMM dd', {
    timeZone: userTimezone,
    locale: locale,
  });

  const endOfWeekFormatted = format(endOfWeek, 'MMMM dd', {
    timeZone: userTimezone,
    locale: locale,
  });

  return (
    <Layout>
      <div className="overflow-auto h-full">
        <div className="flex-container">
          <div className="lesson-wrapper flex-lefts student-dashboard">
            <div>
              <div className="container title-container px-4">
                <h1 className="title lelt-con mb-2.5">
                  {lesson
                    ? t('reschedule_lesson', { ns: 'modals' })
                    : t('schedule_lesson')}
                </h1>
                <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px] left-subtitle">
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
              <div className="flex w-full items-center justify-between px-4 mb-4">
                <div>
                  <button
                    className="disabled:opacity-50"
                    disabled={counter === 0}
                    onClick={() => {
                      resetAll();
                      setCounter(counter - 1);
                    }}
                  >
                    <img
                      className="w-full"
                      style={{ transform: 'rotate(180deg)' }}
                      src={forward_arrow}
                      alt=""
                    />
                  </button>
                </div>

                <div>
                  <h1 className="justify-content-center mt-0 my-3 text-2xl text-center sm:text-4xl">
                    {startOfWeekFormatted} to {endOfWeekFormatted}
                  </h1>
                </div>

                <div>
                  <button
                    className="disabled:opacity-50"
                    onClick={() => {
                      resetAll();
                      setCounter(counter + 1);
                    }}
                    disabled={counter === 4}
                  >
                    <img className="w-full" src={forward_arrow} alt="" />
                  </button>
                </div>
              </div>

              <div className="row customDay-select m-0">
                <div className="col-6 px-4">
                  <Days startOfWeek={startOfWeek} counter={counter} />
                </div>

                <div className="col-6 px-4">
                  <TimesOfDay />
                </div>
              </div>
              <div className="p-4">
                <div className="col-auto back-btn-container ">
                  <button
                    className="enter-btn btn-dash-return ms-0 back-btn-schedule"
                    onClick={() => setTabIndex(0)}
                  >
                    <img src={custom_back_arrow} alt="" />
                    <div className="ms-2">{t('custom_back')}</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="availability-wrapper flex-rights student-list-appointments-wrapper changes-container schedule_height">
            <AvailableTimes setIsLoading={setIsLoading} />
          </div>
        </div>
      </div>

      {/* Думаю не понадобится */}
      {isLoading && (
        <Loader
          color="#00BFFF"
          className="align-center"
          type="TailSpin"
          height={80}
          width={80}
        />
      )}
    </Layout>
  );
};
