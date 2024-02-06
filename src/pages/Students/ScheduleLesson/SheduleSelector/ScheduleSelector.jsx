import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../../../components/Layout';
import custom_back_arrow from 'src/assets/images/custom_back_arrow.svg';
import forward_arrow from 'src/assets/images/forward_arrow.svg';
import Loader from 'react-loader-spinner';
import { useAuth } from '../../../../modules/auth';
import { gql, useLazyQuery } from '@apollo/client';
import { getItemToLocalStorage } from 'src/constants/global';
import {
  addDays,
  addWeeks,
  endOfISOWeek,
  isAfter,
  isSameDay,
  isWithinInterval,
  parse,
  startOfISOWeek,
} from 'date-fns';
import { format, utcToZonedTime } from 'date-fns-tz';
import { ko as kr } from 'date-fns/locale';
import { AvailableSpots } from './AvailableSpots';

const GET_TIMESHEETS = gql`
  query combinedTimesheets(
    $tz: String!
    $date: String!
    $duration: String!
    $studentId: ID!
    $mentorId: ID
  ) {
    combinedTimesheets(
      tz: $tz
      date: $date
      duration: $duration
      mentorId: $mentorId
      studentId: $studentId
    ) {
      id
      day
      from
      to
      reserved
    }
  }
`;

const ScheduleSelector = ({
  setTabIndex,
  duration,
  setSchedule,
  lesson,
  selectedTutor,
}) => {
  const [t, i18n] = useTranslation(['lessons', 'common', 'modals']);

  const currentLanguage = i18n.language;
  const locale = currentLanguage === 'kr' ? kr : null;

  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const todayUserTimezone = () => {
    return utcToZonedTime(new Date(), userTimezone);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [dayClicked, setDayClicked] = useState(null);
  const [timeClicked, setTimeClicked] = useState(null);
  const [day, setDay] = useState(todayUserTimezone());
  const [days, setDays] = useState([]);
  const [allTimes, setAllTimes] = useState([]);
  const [timeOfDay, setTimeOfDay] = useState({
    start: '',
    end: '',
  });

  const [timeArr, setTimeArr] = useState([]);

  const [getTimesheetsData, { data: timesheetsData }] = useLazyQuery(
    GET_TIMESHEETS,
    {
      fetchPolicy: 'network-only',
    },
  );

  const today = addWeeks(todayUserTimezone(), counter);

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

  const morningInterval = {
    start: parse('00:00', 'HH:mm', todayUserTimezone()),
    end: parse('11:59', 'HH:mm', todayUserTimezone()),
  };
  const afternoonInterval = {
    start: parse('12:00', 'HH:mm', todayUserTimezone()),
    end: parse('17:59', 'HH:mm', todayUserTimezone()),
  };
  const eveningInterval = {
    start: parse('18:00', 'HH:mm', todayUserTimezone()),
    end: parse('23:59', 'HH:mm', todayUserTimezone()),
  };

  // formation morning/afternoon/evening taking into account the current time and available metor slots
  const setDayInterval = (currentTime) => {
    let morning = false;
    let afternoon = false;
    let evening = false;
    let timeArr = [];

    let currentMorningInterval = morningInterval;
    let currentAfternoonInterval = afternoonInterval;
    let currentEveningInterval = eveningInterval;

    // If the current day is then you need to change the intervals from the current time to (11:59/17:59/23:59)
    if (currentTime) {
      if (isWithinInterval(currentTime, morningInterval)) {
        currentMorningInterval = {
          start: currentTime,
          end: morningInterval.end,
        };
      }

      if (isWithinInterval(currentTime, afternoonInterval)) {
        morning = true;
        currentAfternoonInterval = {
          start: currentTime,
          end: afternoonInterval.end,
        };
      }

      if (isWithinInterval(currentTime, eveningInterval)) {
        morning = true;
        afternoon = true;
        currentEveningInterval = {
          start: currentTime,
          end: eveningInterval.end,
        };
      }
    }

    timesheetsData?.combinedTimesheets
      .sort(
        (a, b) =>
          parse(a.from, 'HH:mm', todayUserTimezone()) -
          parse(b.from, 'HH:mm', todayUserTimezone()),
      )
      .forEach((timesheet) => {
        const tempTime = parse(timesheet.from, 'HH:mm', todayUserTimezone());

        if (isWithinInterval(tempTime, currentMorningInterval) && !morning) {
          timeArr.push({
            time: 'Morning',
            format: 'time',
          });

          morning = true;
          return;
        }
        if (
          isWithinInterval(tempTime, currentAfternoonInterval) &&
          !afternoon
        ) {
          timeArr.push({
            time: 'Afternoon',
            format: 'time',
          });

          afternoon = true;
          return;
        }
        if (isWithinInterval(tempTime, currentEveningInterval) && !evening) {
          timeArr.push({
            time: 'Evening',
            format: 'time',
          });

          evening = true;
          return;
        }
      });

    setTimeArr(timeArr);
  };

  // morning/afternoon/evening formation
  useEffect(() => {
    if (timesheetsData) {
      const checkIsToday = isSameDay(new Date(day), todayUserTimezone());

      if (checkIsToday) {
        const currentTime = todayUserTimezone();
        setDayInterval(currentTime);
      } else {
        setDayInterval();
      }
    }
  }, [timesheetsData]);

  //Loop over the times - only pushes time with 30 minutes interval
  useEffect(() => {
    if (timeOfDay.start && timeOfDay.end) {
      const availableSlots = [];
      timesheetsData?.combinedTimesheets.forEach((timesheet) => {
        const tempTime = parse(timesheet.from, 'HH:mm', todayUserTimezone());

        if (isWithinInterval(tempTime, timeOfDay)) {
          availableSlots.push({
            time: timesheet.from,
            reserved: timesheet.reserved,
          });
        }
      });

      setAllTimes(availableSlots);
    }
  }, [timeOfDay]);

  // Days of the week are formed (Mon - Sun)
  useEffect(() => {
    const availableDays = [];

    for (let i = 0; i < 7; i++) {
      const tempDay = addDays(startOfWeek, i);

      if (
        isAfter(tempDay, todayUserTimezone()) ||
        isSameDay(tempDay, todayUserTimezone())
      ) {
        const dayOfTheWeek = {
          day: format(tempDay, 'yyyy-MM-dd HH:mm:ss', {
            timeZone: userTimezone,
          }),
          format: 'day',
        };
        availableDays.push(dayOfTheWeek);
      }
    }

    setDays(availableDays);
  }, [counter]);

  const resetAvailableSpots = () => {
    setDayClicked(null);
    setTimeClicked(null);
    setTimeArr([]);
  };

  const DaySelector = ({ data, i }) => {
    const isClicked = () => {
      if (data.format === 'day') {
        setDayClicked(i);
        setTimeClicked(null);
        setTimeArr([]);

        setDay(data.day);
        getTimesheetsData({
          variables: {
            tz: userTimezone,
            date: format(new Date(data.day), 'yyyy-MM-dd', {
              timeZone: userTimezone,
            }),
            duration: String(duration).toString(),
            ...(selectedTutor && {
              mentorId: selectedTutor.id,
            }),
            studentId: getItemToLocalStorage('studentId'),
          },
        });
      }

      if (data.format === 'time') {
        setTimeClicked(i);

        const isSame = isSameDay(new Date(day), todayUserTimezone());

        if (data.time === 'Morning') {
          const isCurrentMorning = isWithinInterval(
            todayUserTimezone(),
            morningInterval,
          );

          if (isCurrentMorning && isSame) {
            setTimeOfDay({
              start: todayUserTimezone(),
              end: morningInterval.end,
            });
          } else {
            setTimeOfDay(morningInterval);
          }
        }
        if (data.time === 'Afternoon') {
          const isCurrentArternoon = isWithinInterval(
            todayUserTimezone(),
            afternoonInterval,
          );

          if (isCurrentArternoon && isSame) {
            setTimeOfDay({
              start: todayUserTimezone(),
              end: afternoonInterval.end,
            });
          } else {
            setTimeOfDay(afternoonInterval);
          }
        }
        if (data.time === 'Evening') {
          const isCurrentEvening = isWithinInterval(
            todayUserTimezone(),
            eveningInterval,
          );

          if (isCurrentEvening && isSame) {
            setTimeOfDay({
              start: todayUserTimezone(),
              end: eveningInterval.end,
            });
          } else {
            setTimeOfDay(eveningInterval);
          }
        }
      }
    };
    return (
      <div
        className={`day-selector  rounded-md border-2 text-center my-3 ${
          i === dayClicked || i === timeClicked
            ? 'schedule_lesson_day bg-color-purple'
            : 'schedule_lesson_day_unselect bg-white'
        }`}
        onClick={isClicked}
      >
        <div>
          {t(
            data.day &&
              format(new Date(data.day), 'EEEE', {
                timeZone: userTimezone,
              }),
            {
              ns: 'common',
            },
          ) || t(data.time, { ns: 'common' })}
        </div>
      </div>
    );
  };

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
                      setCounter(counter - 1);
                      resetAvailableSpots();
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
                      setCounter(counter + 1);
                      resetAvailableSpots();
                    }}
                    disabled={counter === 4}
                  >
                    <img className="w-full" src={forward_arrow} alt="" />
                  </button>
                </div>
              </div>

              <div className="row customDay-select m-0">
                <div className="col-6 px-4">
                  {days?.map(
                    (x, i) =>
                      x.format === 'day' && (
                        <DaySelector data={x} i={i} key={i} />
                      ),
                  )}
                </div>

                <div className="col-6 px-4">
                  {timeArr.map((x, i) => {
                    i = i + 10;
                    if (x.format === 'time') {
                      return <DaySelector data={x} i={i} key={i} />;
                    }
                  })}
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
            {dayClicked !== null && timeClicked ? (
              <AvailableSpots
                allTimes={allTimes}
                day={day}
                duration={duration}
                setIsLoading={setIsLoading}
                setSchedule={setSchedule}
                setTabIndex={setTabIndex}
              />
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
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

export default ScheduleSelector;
