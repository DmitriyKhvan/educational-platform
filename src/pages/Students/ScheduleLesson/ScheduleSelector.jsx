import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import Layout from '../../../components/Layout';
import custom_back_arrow from '../../../assets/images/custom_back_arrow.svg';
import prev_arrow from '../../../assets/images/prev_arrow.svg';
import forward_arrow from '../../../assets/images/forward_arrow.svg';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { getTutorList } from '../../../actions/tutor';
import Loader from 'react-loader-spinner';
import TutorApi from '../../../api/TutorApi';

const useTimesheets = (body) => {
  const [data, setData] = useState({});
  useEffect(() => {
    TutorApi.getTimesheets(body).then(({ data }) => {
      setData(data);
    });
  }, [body.date]);
  return { data };
};

const ScheduleSelector = ({
  setTabIndex,
  duration,
  step,
  setSchedule,
  lesson,
  tabIndex,
  schedule,
  setTutorIdList,
  selectedTutor,
}) => {
  const [t] = useTranslation(['lessons', 'common', 'modals']);
  const user = useSelector((state) => state.users.user);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [counter, setCounter] = useState(0);
  const [dayClicked, setDayClicked] = useState(null);
  const [timeClicked, setTimeClicked] = useState(null);
  const [day, setDay] = useState();
  const [timeOfDay, setTimeOfDay] = useState({
    slotInterval: 0,
    startTime: '',
    endTime: '',
  });

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const disable = counter === 0;
  const today = moment.tz(userTimezone).subtract(counter, 'week');
  const startOfWeek = today.startOf('isoWeek');
  const startOfWeekString = startOfWeek.toString();
  const startOfWeekFormatted = `${t(startOfWeek.format('MMMM'), {
    ns: 'common',
  })} ${startOfWeek.format('DD')}${t('kor_day', { ns: 'common' })}`;
  const endOfWeek = today.endOf('isoWeek');
  const endOfWeekFormatted = `${t(endOfWeek.format('MMMM'), {
    ns: 'common',
  })} ${endOfWeek.format('DD')}${t('kor_day', { ns: 'common' })}`;
  const timeFormatter = 'HH:mm:ss';

  const isToday = moment.tz(userTimezone);
  const checkAgainstToday = moment(isToday, timeFormatter);

  //Format the time
  const startTime = moment(timeOfDay.startTime, 'HH:mm');

  //Format the end time and the next day to it
  const endTime = moment(timeOfDay.endTime, 'HH:mm');

  const days = [];
  const allTimes = [];
  let timeArr = [];

  const morningCheck = [
    moment('00:00:00', timeFormatter),
    moment(step === 30 ? '11:30:00' : '11:00:00', timeFormatter),
  ];

  const afternoonCheck = [
    moment(step === 30 ? '11:30:00' : '11:00:00', timeFormatter),
    moment(step ? '17:30:00' : '17:00:00', timeFormatter),
  ];

  const eveningCheck = [
    moment(step ? '17:30:00' : '17:00:00', timeFormatter),
    moment(step === 30 ? '23:30:00' : '23:00:00', timeFormatter),
  ];

  if (day) {
    const formatDay = moment(day);
    const checkIsToday = moment(formatDay.format('YYYY-MM-DD')).isSame(
      isToday.format('YYYY-MM-DD'),
      'day',
    );
    if (checkIsToday) {
      if (checkAgainstToday.isBetween(...morningCheck)) {
        timeArr.push({
          time: 'Morning',
          format: 'time',
        });
      }
      if (
        checkAgainstToday.isBetween(...morningCheck) ||
        checkAgainstToday.isBetween(...afternoonCheck)
      ) {
        timeArr.push({
          time: 'Afternoon',
          format: 'time',
        });
      }
      if (
        checkAgainstToday.isBetween(...morningCheck) ||
        checkAgainstToday.isBetween(...afternoonCheck) ||
        checkAgainstToday.isBetween(...eveningCheck)
      ) {
        timeArr.push({
          time: 'Evening',
          format: 'time',
        });
      }
    } else {
      timeArr.push(
        {
          time: 'Morning',
          format: 'time',
        },
        {
          time: 'Afternoon',
          format: 'time',
        },
        {
          time: 'Evening',
          format: 'time',
        },
      );
    }
  }

  // const {
  //   data: timesheetsData
  // } = useQuery(GET_TIMESHEETS, {
  //   variables: {
  //     day: moment(day).format('dddd'),
  //   },
  // });

  const { data: timesheetsData } = useTimesheets({
    tz: userTimezone,
    date: moment(day).format('YYYY-MM-DD'),
    step,
    ...(selectedTutor && {
      tutorId: selectedTutor.id,
    }),
  });

  //Loop over the times - only pushes time with 30 minutes interval
  while (startTime.isBefore(endTime) || startTime.isSame(endTime)) {
    const tempTime = moment(startTime.format('HH:mm'), 'HH:mm');
    timesheetsData?.timesheets.map((timesheet) => {
      if (
        selectedTutor &&
        !timesheet?.tutorIds?.includes(parseInt(selectedTutor?.id))
      )
        return;

      const timesheetFrom = moment(timesheet.from, 'HH:mm');
      const timesheetTo = moment(timesheet.to, 'HH:mm');
      // Third argument is for units (for which we do not care right now)
      // Fourth parameter '[)' means that the end time is not included
      if (tempTime.isBetween(timesheetFrom, timesheetTo, null, '[)')) {
        allTimes.push(startTime.format('HH:mm'));
        return timesheet;
      }
    });
    startTime.add(step, 'minutes');
  }

  for (let i = 0; i <= 6; i++) {
    const dayOfTheWeek = {
      day: moment(startOfWeekString).add(i, 'days').toString(),
      format: 'day',
    };
    days.push(dayOfTheWeek);
  }
  const DaySelector = ({ data, i }) => {
    const checkDate = () => {
      if (data.format === 'day') {
        const unixEpoch = moment(data.day).unix() * 1000;
        const isBeforeToday = moment(unixEpoch).diff(moment(), 'day');
        if (isBeforeToday < 0) {
          return false;
        } else {
          return true;
        }
      }
      return true;
    };
    const isAfterToday = checkDate();

    const isClicked = () => {
      if (data.format === 'day') {
        if (isAfterToday) {
          setDayClicked(i);
          setDay(data.day);
          setTimeOfDay({ slotInterval: step, startTime: '', endTime: '' });
          timeArr = [];
          setTimeClicked(null);
        }
      }

      if (data.format === 'time') {
        setTimeClicked(i);
        const roundUp =
          isToday.minute() || isToday.second() || isToday.millisecond()
            ? isToday.add(1, 'hour').startOf('hour')
            : isToday.startOf('hour');
        const isSame = moment(isToday.format('YYYY-MM-DD')).isSame(
          moment(day).format('YYYY-MM-DD'),
        );
        if (data.time === 'Morning') {
          if (checkAgainstToday.isBetween(...morningCheck) && isSame) {
            setTimeOfDay({
              slotInterval: step,
              startTime: roundUp.format('HH:mm'),
              endTime: '11:30',
            });
          } else {
            setTimeOfDay({
              slotInterval: step,
              startTime: '09:00',
              endTime: '11:30',
            });
          }
        }
        if (data.time === 'Afternoon') {
          if (checkAgainstToday.isBetween(...afternoonCheck) && isSame) {
            setTimeOfDay({
              slotInterval: step,
              startTime: roundUp.format('HH:mm'),
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
          if (checkAgainstToday.isBetween(...eveningCheck) && isSame) {
            setTimeOfDay({
              slotInterval: step,
              startTime: roundUp.format('HH:mm'),
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
        {isAfterToday && (
          <div
            className={`day-selector text-center my-3 ${
              i === dayClicked || i === timeClicked
                ? 'schedule_lesson_day'
                : 'schedule_lesson_day_unselect'
            }`}
            onClick={isClicked}
          >
            <div>
              {t(data.day && moment(data.day).format('dddd'), {
                ns: 'common',
              }) || t(data.time, { ns: 'common' })}
              {/* {(data.day && moment(data.day).format('dddd')) || data.time} */}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  };

  const handleConfirmLesson = (scheduleStartTime) => {
    const formattedDay = moment(day).format('YYYY-MM-DD');
    const selectedSchedule = moment.tz(
      formattedDay + ' ' + scheduleStartTime,
      userTimezone,
    );
    const hoursPrior = 48;
    const preScreen = moment
      .tz(formattedDay + ' ' + scheduleStartTime, userTimezone)
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
        text: t('swal_fire_text_schedule_prescreen', { ns: 'modals' }),
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
    const scheduleEndTime = moment(scheduleStartTime, [
      moment.ISO_8601,
      'HH:mm',
    ])
      .add(duration, 'minutes')
      .format('hh:mm A');

    return (
      <div
        className={`time-card grey-border bg-white small-card pt-2 mt-4 media_align_width`}
      >
        <div className="row container ms-1">
          <div className="col-12 align_schedule_texts">
            <h3 className={`text-black change_width_schedule`}>
              {moment(scheduleStartTime, [moment.ISO_8601, 'HH:mm']).format(
                'hh:mm A',
              )}{' '}
              → {scheduleEndTime}
            </h3>
          </div>
        </div>
        <div className="row final_width_change">
          <div className="col">
            <div className="schedule-card-col">
              <p className={`enter-btn time-btn grey-border text-black`}>
                {`${t(moment(day).format('dddd'), { ns: 'common' })}, ${t(
                  moment(day).format('MMMM'),
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
                className={`enter-btn btn-primary align_button_sche_lesson`}
                onClick={() => {
                  handleConfirmLesson(scheduleStartTime);
                }}
              >
                {t('confirm_lesson')}
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
      <div className="row ">
        <h1 className="title right-con-title">{t('available_spots')}</h1>
        <p className="welcome-subtitle right-con-subtitle">
          {t('available_spots_subtitle')}
        </p>
      </div>
      <div className="row schedule-overflow-scroll slot-scroll col-12 media_small_width_schedule">
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
      <div className="scroll-layout">
        <div className="flex-container">
          <div className="lesson-wrapper flex-lefts student-dashboard">
            <div>
              <div className="container title-container">
                <h1 className="title lelt-con">
                  {lesson ? t('reschedule_lesson') : t('schedule_lesson')}
                </h1>
                <p className="welcome-subtitle left-subtitle">
                  {lesson ? (
                    <>
                      {t('choose_new_date', { ns: 'modals' })}
                      <br />
                      <br />
                      Currently lesson scheduled at{' '}
                      {moment(lesson.startAt)
                        .tz(userTimezone)
                        .format('dddd, MMM DD hh:mm A')}
                    </>
                  ) : (
                    t('schedule_lesson_subtitle')
                  )}
                </p>
              </div>
              <div className="row container ps-4 pe-0">
                <div className="col-1 leftArrow">
                  <button
                    className="btn btn-dash-return leftArrow-btn"
                    disabled={disable}
                    onClick={() => {
                      setCounter(counter + 1);
                      setDayClicked(null);
                    }}
                  >
                    <img src={prev_arrow} alt="" />
                  </button>
                </div>
                <div className="col-10">
                  <h1 className="justify-content-center mt-0">
                    {startOfWeekFormatted} to {endOfWeekFormatted}
                  </h1>
                </div>
                <div className="col-1 ps-0 rightArrow">
                  <button
                    className="btn btn-dash-return rightArrow-btn"
                    onClick={() => {
                      setCounter(counter - 1);
                      setDayClicked(null);
                    }}
                  >
                    <img src={forward_arrow} alt="" />
                  </button>
                </div>
              </div>
              <div className="row customDay-select">
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
              <div className="row container pt-3">
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
