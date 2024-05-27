import { useState, useEffect } from 'react';

import { format, toZonedTime } from 'date-fns-tz';
import {
  addHours,
  addMonths,
  differenceInHours,
  isSameDay,
  isWithinInterval,
  parse,
} from 'date-fns';
import { useLazyQuery } from '@apollo/client';

import { ScheduleContext } from '../lib/ScheduleContext';
import { useAuth } from 'src/modules/auth';
import { useDebounce } from 'src/utils/useDebounce';
import { getItemToLocalStorage } from 'src/constants/global';
import { scrollToElement } from 'src/utils/scrollToElement';
import notify from 'src/utils/notify';

export const ScheduleProvider = ({
  query,
  setTabIndex,
  setSchedule,
  selectedMentor,
  setSelectMentor, // trial
  timeZone,
  duration,
  children,
}) => {
  const [
    getTimesheetsData,
    { loading: timesheetsLoading, data: timesheetsData },
  ] = useLazyQuery(query, {
    // fetchPolicy: 'network-only',
    fetchPolicy: 'no-cache',
    onError: (error) => {
      notify(error.message, 'error');
      resetAll();
    },
  });

  const hourPrior = process.env.REACT_APP_PRODUCTION === 'true' ? 48 : 0;

  const { user } = useAuth();

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    timeZone ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const todayUserTimezone = toZonedTime(new Date(), userTimezone);

  const [day, setDay] = useState(todayUserTimezone);
  const [timesOfDay, setTimesOfDay] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [timeOfDayInterval, setTimeOfDayInterval] = useState({
    start: '',
    end: '',
  });

  const [dayClicked, setDayClicked] = useState(null);
  const [timeClicked, setTimeClicked] = useState(null);

  const endMonth = addMonths(todayUserTimezone, 1);
  const isToday = isSameDay(new Date(day), todayUserTimezone);

  const morningInterval = {
    start: parse('00:00', 'HH:mm', new Date(day)),
    end: parse('11:59', 'HH:mm', new Date(day)),
  };
  const afternoonInterval = {
    start: parse('12:00', 'HH:mm', new Date(day)),
    end: parse('17:59', 'HH:mm', new Date(day)),
  };
  const eveningInterval = {
    start: parse('18:00', 'HH:mm', new Date(day)),
    end: parse('23:59', 'HH:mm', new Date(day)),
  };

  const resetAll = () => {
    setDay(todayUserTimezone);
    setTimesOfDay([]);
    // setAvailableTimes([]);
    setDayClicked(null);
    setTimeClicked(null);
  };

  const debouncedTimesheetsData = useDebounce(day, 500);

  useEffect(() => {
    if (debouncedTimesheetsData && dayClicked !== null) {
      setTimeClicked(null);
      // setAvailableTimes([]);
      getTimesheetsData({
        variables: {
          tz: userTimezone,
          date: format(new Date(debouncedTimesheetsData), 'yyyy-MM-dd', {
            timeZone: userTimezone,
          }),
          duration: duration && String(duration).toString(),
          ...(selectedMentor && {
            mentorId: selectedMentor.id,
          }),
          studentId: getItemToLocalStorage('studentId'),
        },
      });
    }
  }, [debouncedTimesheetsData]);

  // formation morning/afternoon/evening taking into account the current time and available metor slots
  const setDayInterval = ({ currentTime, lastTime }) => {
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

    if (lastTime) {
      if (isWithinInterval(lastTime, morningInterval)) {
        afternoon = true;
        evening = true;
        currentMorningInterval = {
          start: morningInterval.start,
          end: lastTime,
        };
      }

      if (isWithinInterval(lastTime, afternoonInterval)) {
        evening = true;
        currentAfternoonInterval = {
          start: afternoonInterval.start,
          end: lastTime,
        };
      }

      if (isWithinInterval(lastTime, eveningInterval)) {
        currentEveningInterval = {
          start: eveningInterval.start,
          end: lastTime,
        };
      }
    }

    structuredClone(
      timesheetsData?.combinedTimesheets ||
        timesheetsData?.combinedTimesheetsForTrials,
    )
      .sort(
        (a, b) =>
          parse(a.from, 'HH:mm', new Date(day)) -
          parse(b.from, 'HH:mm', new Date(day)),
      )
      .forEach((timesheet) => {
        const tempTime = parse(timesheet.from, 'HH:mm', new Date(day));

        if (isWithinInterval(tempTime, currentMorningInterval) && !morning) {
          timeArr.push('Morning');

          morning = true;
          return;
        }
        if (
          isWithinInterval(tempTime, currentAfternoonInterval) &&
          !afternoon
        ) {
          timeArr.push('Afternoon');

          afternoon = true;
          return;
        }
        if (isWithinInterval(tempTime, currentEveningInterval) && !evening) {
          timeArr.push('Evening');

          evening = true;
          return;
        }
      });

    setTimesOfDay(timeArr);
  };

  // morning/afternoon/evening formation
  useEffect(() => {
    if (timesheetsData) {
      if (differenceInHours(new Date(day), todayUserTimezone) <= hourPrior) {
        setDayInterval({
          currentTime: addHours(todayUserTimezone, hourPrior),
        });
      } else if (differenceInHours(endMonth, new Date(day)) < 24) {
        setDayInterval({ lastTime: endMonth });
      } else {
        setDayInterval({ currentTime: '' });
      }
      setTimeout(() => scrollToElement('timeOfDay'), 100);
    }
  }, [timesheetsData]);

  //Loop over the times - only pushes time with 30 minutes interval
  useEffect(() => {
    if (timeOfDayInterval.start && timeOfDayInterval.end) {
      const availableSlots = [];

      (
        timesheetsData?.combinedTimesheets ||
        // eslint-disable-next-line no-unsafe-optional-chaining
        timesheetsData?.combinedTimesheetsForTrials
      ).forEach((timesheet) => {
        const tempTime = parse(timesheet.from, 'HH:mm', new Date(day));

        if (
          isWithinInterval(tempTime, timeOfDayInterval) &&
          !timesheet.reserved
        ) {
          availableSlots.push({
            time: timesheet.from,
            reserved: timesheet.reserved,
            mentorId: timesheet.mentors && timesheet.mentors[0],
          });
        }
      });

      setAvailableTimes(availableSlots);
    }
  }, [timeOfDayInterval.start]);

  return (
    <ScheduleContext.Provider
      value={{
        userTimezone,
        setTabIndex,
        setSchedule,
        selectedMentor,
        duration,
        setDay,
        day,
        setTimesOfDay,
        timesOfDay,
        setTimeOfDayInterval,
        timeOfDayInterval,
        setAvailableTimes,
        availableTimes,
        getTimesheetsData,
        timesheetsLoading,
        timesheetsData,
        dayClicked,
        setDayClicked,
        setTimeClicked,
        timeClicked,
        todayUserTimezone,
        morningInterval,
        afternoonInterval,
        eveningInterval,
        endMonth,
        isToday,
        resetAll,
        setSelectMentor,
        hourPrior,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
