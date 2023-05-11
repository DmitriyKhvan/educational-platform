import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import Loader from '../common/Loader';
import { getTutorList } from '../../actions/tutor';
import { useDispatch } from 'react-redux';
import Swal from 'sweetalert2';

const ReschedulingTimeModal = ({
  setSchedule,
  setTabIndex,
  type,
  duration,
}) => {
  const [t] = useTranslation(['lessons', 'common', 'modals']);
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

  const disable = counter === 0;
  const timeFormatter = 'HH:mm:ss';

  const today = moment().subtract(counter, 'week');
  const isToday = moment();
  const checkAgainstToday = moment(isToday, timeFormatter);

  const startOfWeek = today.startOf('isoWeek');
  const startOfWeekString = startOfWeek.toString();
  const startOfWeekFormatted = startOfWeek.format('MMMM DD');
  const endOfWeek = today.endOf('isoWeek').format('MMMM DD');

  const startTime = moment(timeOfDay.startTime, 'HH:mm');
  const endTime = moment(timeOfDay.endTime, 'HH:mm');

  const days = [];
  const allTimes = [];
  let timeArr = [];

  const morningCheck = [
    moment('00:00:00', timeFormatter),
    moment(duration === 30 ? '11:30:00' : '11:00:00', timeFormatter),
  ];

  const afternoonCheck = [
    moment(duration === 30 ? '11:30:00' : '11:00:00', timeFormatter),
    moment(duration ? '17:30:00' : '17:00:00', timeFormatter),
  ];

  const eveningCheck = [
    moment(duration ? '17:30:00' : '17:00:00', timeFormatter),
    moment(duration === 30 ? '23:30:00' : '23:00:00', timeFormatter),
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

  //Loop over the times - only pushes time with 30 minutes interval
  if (timeClicked) {
    while (startTime <= endTime) {
      allTimes.push(startTime.format('HH:mm'));
      startTime.add(timeOfDay.slotInterval, 'minutes');
    }
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
          setTimeOfDay({ slotInterval: duration, startTime: '', endTime: '' });
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
              slotInterval: duration,
              startTime: roundUp.format('HH:mm'),
              endTime: '11:30',
            });
          } else {
            setTimeOfDay({
              slotInterval: duration,
              startTime: '00:00',
              endTime: '11:30',
            });
          }
        }
        if (data.time === 'Afternoon') {
          if (checkAgainstToday.isBetween(...afternoonCheck) && isSame) {
            setTimeOfDay({
              slotInterval: duration,
              startTime: roundUp.format('HH:mm'),
              endTime: '17:30',
            });
          } else {
            setTimeOfDay({
              slotInterval: duration,
              startTime: '12:00',
              endTime: '17:30',
            });
          }
        }
        if (data.time === 'Evening') {
          if (checkAgainstToday.isBetween(...eveningCheck) && isSame) {
            setTimeOfDay({
              slotInterval: duration,
              startTime: roundUp.format('HH:mm'),
              endTime: '23:30',
            });
          } else {
            setTimeOfDay({
              slotInterval: duration,
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
              i === dayClicked || i === timeClicked ? 'purple-border' : ''
            }`}
            onClick={isClicked}
          >
            <h3>
              {(data.day && moment(data.day).format('dddd')) || data.time}
            </h3>
          </div>
        )}
      </React.Fragment>
    );
  };

  const ScheduleCard = ({ scheduleStartTime }) => {
    const scheduleEndTime = moment(scheduleStartTime, [
      moment.ISO_8601,
      'HH:mm',
    ])
      .add(duration, 'minutes')
      .format('hh:mm A');

    return (
      <div className="time-card grey-border bg-white small-card pt-2 mt-4 container">
        <div className="ms-1">
          <div className="col-12 ps-2">
            <h3 className={`text-black`}>
              {moment(scheduleStartTime, [moment.ISO_8601, 'HH:mm']).format(
                'hh:mm A',
              )}{' '}
              → {scheduleEndTime}
            </h3>
          </div>
        </div>

        <div className="schedule-card-col">
          <p
            className={`enter-btn time-btn grey-border text-black align_button_sche_lesson`}
          >
            {moment(day).format('dddd, MMM DD')}
          </p>
        </div>
        <div className="schedule-card-col">
          <div
            className={`enter-btn btn-primary`}
            onClick={() => {
              const dayMoment = moment(day);
              const selectedSchedule = moment()
                .year(dayMoment.year())
                .month(dayMoment.month())
                .hours(scheduleStartTime.split(':')[0])
                .minutes(scheduleStartTime.split(':')[1])
                .seconds(0)
                .utc()
                .date(dayMoment.date());
              setIsLoading(true);
              setSchedule(selectedSchedule.toString());
              dispatch(getTutorList(selectedSchedule.toString())).then(
                (response) => {
                  const tutorlist = response.payload.tutors;
                  if (tutorlist.length > 0) {
                    setTabIndex(3);
                  }
                  if (tutorlist.length === 0) {
                    Swal.fire({
                      title: 'No Tutors Available for selected Time',
                      text: '',
                      icon: 'warning',
                      confirmButtonColor: '#6133af',
                      cancelButtonColor: '#d33',
                      target: 'body > div.ReactModalPortal > div > div',
                    });
                  }
                  setIsLoading(false);
                },
              );
            }}
          >
            {t('confirm_lesson')}
          </div>
        </div>
      </div>
    );
  };

  const AvailableSpots = () => (
    <React.Fragment>
      <h2 className="mb-2">{t('available_spots')}</h2>
      <p className="welcome-subtitle text-purple">
        {t('available_spots_subtitle')}
      </p>
      <div
        className="px-4"
        style={{ height: '40rem', width: 'auto', overflowY: 'scroll' }}
      >
        {allTimes.map((x, i) => (
          <ScheduleCard scheduleStartTime={x} key={i} />
        ))}
      </div>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <div className="container" style={{ width: '75vw' }}>
        <div className="row">
          <div className="col pe-4">
            <h2>{t('reschedule_lesson', { ns: 'modals' })}</h2>
            <div className="row align-items-start">
              <div className="col-1">
                <button
                  className="btn"
                  disabled={disable}
                  onClick={() => {
                    setCounter(counter + 1);
                    setDayClicked(null);
                  }}
                >
                  ←
                </button>
              </div>
              <div className="col">
                <h3 className="justify-content-center text-center mt-2">
                  {startOfWeekFormatted} to {endOfWeek}
                </h3>
              </div>
              <div className="col-1">
                <button
                  className="btn"
                  onClick={() => {
                    setCounter(counter - 1);
                    setDayClicked(null);
                  }}
                >
                  →
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col px-4">
                <p className="text-muted text-center">
                  {t('date', { ns: 'common' })}
                </p>
                {days.map(
                  (x, i) =>
                    x.format === 'day' && (
                      <DaySelector data={x} i={i} key={i} />
                    ),
                )}
              </div>
              <div className="col px-4">
                {dayClicked !== null ? (
                  <p className="text-muted text-center">
                    {t('time', { ns: 'common' })}
                  </p>
                ) : (
                  ''
                )}
                {timeArr.map((x, i) => {
                  i = i + 10;
                  if (x.format === 'time') {
                    return <DaySelector data={x} i={i} key={i} />;
                  }
                })}
              </div>
            </div>
          </div>

          <div className="col">
            {dayClicked !== null && timeClicked ? <AvailableSpots /> : ''}
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </React.Fragment>
  );
};

export default ReschedulingTimeModal;
