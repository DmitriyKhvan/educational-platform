import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import Layout from '../../../components/Layout';
import custom_back_arrow from '../../../assets/images/custom_back_arrow.svg';
import forward_arrow from '../../../assets/images/forward_arrow.svg';
import Swal from 'sweetalert2';
import Loader from 'react-loader-spinner';
import { useAuth } from '../../../modules/auth';
import { gql, useLazyQuery } from '@apollo/client';
import { cn } from 'src/utils/functions';
import { getItemToLocalStorage } from 'src/constants/global';
import {
  addDays,
  addHours,
  addWeeks,
  endOfISOWeek,
  format,
  isAfter,
  isSameDay,
  isWithinInterval,
  parse,
  startOfHour,
  startOfISOWeek,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useEffect } from 'react';

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
  step,
  setSchedule,
  lesson,
  selectedTutor,
}) => {
  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const todayUserTimezone = () => {
    return utcToZonedTime(new Date(), userTimezone);
  };

  // const currentTimeUserTimezone =

  const [t] = useTranslation(['lessons', 'common', 'modals']);

  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const [dayClicked, setDayClicked] = useState(null);
  const [timeClicked, setTimeClicked] = useState(null);
  const [day, setDay] = useState(todayUserTimezone());
  const [timeOfDay, setTimeOfDay] = useState({
    slotInterval: 0,
    startTime: '',
    endTime: '',
  });

  // const { data: timesheetsData } = useTimesheets({
  //   tz: userTimezone,
  //   date: format(new Date(day), 'yyyy-MM-dd', {
  //     timeZone: userTimezone,
  //   }),
  //   duration: String(duration).toString(),
  //   ...(selectedTutor && {
  //     mentorId: selectedTutor.id,
  //   }),
  //   studentId: getItemToLocalStorage('studentId'),
  // });

  // const useTimesheets = (body) => {
  //   const res = useQuery(GET_TIMESHEETS, {
  //     variables: {
  //       ...body,
  //     },
  //     fetchPolicy: 'network-only',
  //   });
  //   return res;
  // };

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
  });

  const endOfWeekFormatted = format(endOfWeek, 'MMMM dd', {
    timeZone: userTimezone,
  });

  //Format the time
  const startTime = moment(timeOfDay.startTime, 'HH:mm');

  //Format the end time and the next day to it
  const endTime = moment(timeOfDay.endTime, 'HH:mm');

  const days = [];
  let allTimes = [];
  // let timeArr = [];
  const [timeArr, setTimeArr] = useState([]);

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
    let isCurrentMorning = true;
    let isCurrentArternoon = true;
    let isCurrentEvening = true;
    let timeArr = [];

    if (currentTime) {
      isCurrentMorning = isWithinInterval(currentTime, morningInterval);
      isCurrentArternoon = isWithinInterval(currentTime, afternoonInterval);
      isCurrentEvening = isWithinInterval(currentTime, eveningInterval);
    }

    timesheetsData?.combinedTimesheets
      .sort(
        (a, b) =>
          parse(a.from, 'HH:mm', todayUserTimezone()) -
          parse(b.from, 'HH:mm', todayUserTimezone()),
      )
      .forEach((timesheet) => {
        const tempTime = parse(timesheet.from, 'HH:mm', todayUserTimezone());

        if (
          isWithinInterval(tempTime, morningInterval) &&
          isCurrentMorning &&
          !morning
        ) {
          timeArr.push({
            time: 'Morning',
            format: 'time',
          });

          morning = true;
          return;
        }
        if (
          isWithinInterval(tempTime, afternoonInterval) &&
          (isCurrentMorning || isCurrentArternoon) &&
          !afternoon
        ) {
          timeArr.push({
            time: 'Afternoon',
            format: 'time',
          });

          afternoon = true;
          return;
        }
        if (
          isWithinInterval(tempTime, eveningInterval) &&
          (isCurrentMorning || isCurrentArternoon || isCurrentEvening) &&
          !evening
        ) {
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
    const checkIsToday = isSameDay(new Date(day), todayUserTimezone());

    if (checkIsToday) {
      const currentTime = todayUserTimezone();
      setDayInterval(currentTime);
    } else {
      setDayInterval();
    }
  }, [day, timesheetsData]);

  console.log('timeOfDay', timeOfDay);

  //Loop over the times - only pushes time with 30 oor 60 minutes interval
  while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
    const tempTime = moment(startTime.format('HH:mm'), 'HH:mm');
    timesheetsData?.combinedTimesheets.map((timesheet) => {
      const timesheetFrom = moment(timesheet.from, 'HH:mm');
      const timesheetTo = moment(timesheet.to, 'HH:mm');
      // Third argument is for units (for which we do not care right now)
      // Fourth parameter '[)' means that the end time is not included
      if (tempTime.isBetween(timesheetFrom, timesheetTo, null, '[)')) {
        allTimes.push({
          time: startTime.format('HH:mm'),
          reserved: timesheet.reserved,
        });
        return timesheet;
      }
    });
    // startTime.add(step, 'minutes');
    startTime.add(30, 'minutes');
  }

  // Days of the week are formed (Mon - Sun)
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
      days.push(dayOfTheWeek);
    }
  }

  const DaySelector = ({ data, i }) => {
    const isClicked = () => {
      if (data.format === 'day') {
        setDayClicked(i);
        setDay(data.day);
        setTimeOfDay({ slotInterval: step, startTime: '', endTime: '' });
        setTimeArr([]);
        setTimeClicked(null);
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

        const roundUp = format(
          startOfHour(addHours(todayUserTimezone(), 1)),
          'HH:mm',
        );
        const isSame = isSameDay(new Date(day), todayUserTimezone());

        console.log('roundUp', roundUp);

        if (data.time === 'Morning') {
          const isCurrentMorning = isWithinInterval(
            todayUserTimezone(),
            morningInterval,
          );

          if (isCurrentMorning && isSame) {
            setTimeOfDay({
              slotInterval: step,
              startTime: roundUp,
              endTime: '11:30',
            });
          } else {
            setTimeOfDay({
              slotInterval: step,
              startTime: '00:00',
              endTime: '11:30',
            });
          }
        }
        if (data.time === 'Afternoon') {
          const isCurrentArternoon = isWithinInterval(
            todayUserTimezone(),
            afternoonInterval,
          );

          if (isCurrentArternoon && isSame) {
            setTimeOfDay({
              slotInterval: step,
              startTime: roundUp,
              endTime: '17:30',
            });
          } else {
            setTimeOfDay({
              slotInterval: step,
              startTime: '12:00',
              endTime: '17:30',
            });
          }
        }
        if (data.time === 'Evening') {
          const isCurrentEvening = isWithinInterval(
            todayUserTimezone(),
            eveningInterval,
          );

          if (isCurrentEvening && isSame) {
            setTimeOfDay({
              slotInterval: step,
              startTime: roundUp,
              endTime: '23:30',
            });
          } else {
            setTimeOfDay({
              slotInterval: step,
              startTime: '18:00',
              endTime: '23:30',
            });
          }
        }
      }
    };
    return (
      <React.Fragment>
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
            {/* {(data.day && moment(data.day).format('dddd')) || data.time} */}
          </div>
        </div>
      </React.Fragment>
    );
  };

  const handleConfirmLesson = (scheduleStartTime) => {
    if (scheduleStartTime.reserved) {
      return;
    }
    const formattedDay = moment(day).format('YYYY-MM-DD');
    const selectedSchedule = moment.tz(
      formattedDay + ' ' + scheduleStartTime.time,
      userTimezone,
    );
    const hoursPrior = process.env.REACT_APP_PRODUCTION === 'true' ? 48 : 0;

    const preScreen = moment
      .tz(formattedDay + ' ' + scheduleStartTime.time, userTimezone)
      .subtract(hoursPrior, 'hours');
    const todayDate = moment();

    if (!todayDate.isBefore(preScreen)) {
      const minutesRound = 30 - (todayDate.minute() % 30);
      const available = moment
        .tz(userTimezone)
        .add(hoursPrior, 'hours')
        .add(minutesRound, 'minutes')
        .format('dddd[,] MMMM DD @ h:mm A');

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

  const ScheduleCard = ({ scheduleStartTime }) => {
    const scheduleEndTime = moment(scheduleStartTime.time, [
      moment.ISO_8601,
      'HH:mm',
    ])
      .add(duration, 'minutes')
      .format('hh:mm A');

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
              {moment(scheduleStartTime.time, [
                moment.ISO_8601,
                'HH:mm',
              ]).format('hh:mm A')}{' '}
              → {scheduleEndTime}
            </h3>
          </div>
        </div>
        <div className="row final_width_change">
          <div className="col">
            <div className="schedule-card-col">
              <p className={`enter-btn time-btn grey-border text-black`}>
                {`${t(moment(day).format('dddd'), { ns: 'common' })}, ${t(
                  moment(day).format('MMM'),
                  { ns: 'common' },
                )} ${moment(day).format('DD')}${t('kor_day', {
                  ns: 'common',
                })}`}
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

  const uniqTimes = [...new Set(allTimes)];

  const AvailableSpots = () => (
    <React.Fragment>
      <div>
        <h1 className="title mb-2.5 available-text">{t('available_spots')}</h1>
        <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px] available-text">
          {t('available_spots_subtitle')}
        </p>
      </div>
      <div className="row schedule-overflow-scroll slot-scroll col-12 media_small_width_schedule gap-4">
        {allTimes.length > 0 &&
          uniqTimes.map((x, i) => (
            <ScheduleCard scheduleStartTime={x} key={i} />
          ))}
        {allTimes.length === 0 && (
          <div className="col-12">
            <p className="text-center">{t('no_available_slots')}</p>
          </div>
        )}
      </div>
    </React.Fragment>
  );

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
                      {moment(lesson.startAt)
                        .tz(userTimezone)
                        .format('dddd, MMM DD hh:mm A')}
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
                      setDayClicked(null);
                      setTimeClicked(null);
                      setTimeArr([]);
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
                      setDayClicked(null);
                      setTimeClicked(null);
                      setTimeArr([]);
                    }}
                    disabled={counter === 4}
                  >
                    <img className="w-full" src={forward_arrow} alt="" />
                  </button>
                </div>

                {/* <div className="col-1">
                  <button
                    className="btn btn-dash-return disabled:opacity-50"
                    onClick={() => {
                      setCounter(counter - 1);
                      setDayClicked(null);
                    }}
                  >
                    <img src={forward_arrow} alt="" />
                  </button>
                </div> */}
              </div>

              <div className="row customDay-select m-0">
                <div className="col-6 px-4">
                  {days.map(
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
            {dayClicked !== null && timeClicked ? <AvailableSpots /> : ''}
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
