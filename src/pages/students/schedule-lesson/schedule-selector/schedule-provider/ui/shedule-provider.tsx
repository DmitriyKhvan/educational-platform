import React, { useEffect, useState, createContext, ReactNode, type Dispatch, type SetStateAction } from "react";
import { useLazyQuery, type DocumentNode } from "@apollo/client";
import {
  addHours,
  addMonths,
  differenceInHours,
  isSameDay,
  isWithinInterval,
  parse,
} from "date-fns";
import { toZonedTime, format } from "date-fns-tz";

import notify from "@/shared/utils/notify";
import { scrollToElement } from "@/shared/utils/scroll-to-element";
import { useDebounce } from "@/shared/utils/use-debounce";
import { useAuth } from "@/app/providers/auth-provider";
import { getItemToLocalStorage } from "@/shared/constants/global";
import { ScheduleContext } from "@/pages/students/schedule-lesson/schedule-selector/schedule-provider/lib/schedule-context";
import type { Mentor, Query } from "@/types/types.generated";

interface ScheduleProviderProps {
  query: DocumentNode
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<string>>;
  selectedMentor: any;
  setSelectMentor?: Dispatch<SetStateAction<Mentor | undefined>>
  timeZone?: string;
  duration: number;
  children: ReactNode;
}

interface TimeOfDayInterval {
  start: string;
  end: string;
}

interface AvailableTime {
  time: string;
  reserved: boolean;
  mentorId: string;
}

export const ScheduleProvider: React.FC<ScheduleProviderProps> = ({
  query,
  setTabIndex,
  setSchedule,
  selectedMentor,
  setSelectMentor, // trial
  timeZone,
  duration,
  children,
}) => {
  const [getTimesheetsData, { loading: timesheetsLoading, data: timesheetsData }] = useLazyQuery(query, {
    fetchPolicy: "no-cache",
    onError: (error) => {
      notify(error.message, "error");
      resetAll();
    },
  });

  const hourPrior = process.env.REACT_APP_PRODUCTION === "true" ? 48 : 0;
  const { user } = useAuth();
  const userTimezone = user?.timeZone?.split(" ")[0] || timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const todayUserTimezone = toZonedTime(new Date(), userTimezone);

  const [day, setDay] = useState<Date>(todayUserTimezone);
  const [timesOfDay, setTimesOfDay] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<AvailableTime[]>([]);
  const [timeOfDayInterval, setTimeOfDayInterval] = useState<TimeOfDayInterval>({ start: "", end: "" });

  const [dayClicked, setDayClicked] = useState<number | null>(null);
  const [timeClicked, setTimeClicked] = useState<string | null>(null);

  const endMonth = addMonths(todayUserTimezone, 1);
  const isToday = isSameDay(new Date(day), todayUserTimezone);

  const morningInterval = {
    start: parse("00:00", "HH:mm", new Date(day)),
    end: parse("11:59", "HH:mm", new Date(day)),
  };
  const afternoonInterval = {
    start: parse("12:00", "HH:mm", new Date(day)),
    end: parse("17:59", "HH:mm", new Date(day)),
  };
  const eveningInterval = {
    start: parse("18:00", "HH:mm", new Date(day)),
    end: parse("23:59", "HH:mm", new Date(day)),
  };

  const resetAll = () => {
    setDay(todayUserTimezone);
    setTimesOfDay([]);
    setDayClicked(null);
    setTimeClicked(null);
  };

  const debouncedTimesheetsData = useDebounce(day, 500);

  useEffect(() => {
    if (debouncedTimesheetsData && dayClicked !== null) {
      setTimeClicked(null);
      getTimesheetsData({
        variables: {
          tz: userTimezone,
          date: format(new Date(debouncedTimesheetsData), "yyyy-MM-dd", {
            timeZone: userTimezone,
          }),
          duration: duration && String(duration).toString(),
          ...(selectedMentor && {
            mentorId: selectedMentor.id,
          }),
          studentId: getItemToLocalStorage("studentId", ""),
        },
      });
    }
  }, [debouncedTimesheetsData]);

  const setDayInterval = ({ currentTime, lastTime }: { currentTime?: Date; lastTime?: Date }) => {
    let morning = false;
    let afternoon = false;
    let evening = false;
    const timeArr: string[] = [];

    let currentMorningInterval = morningInterval;
    let currentAfternoonInterval = afternoonInterval;
    let currentEveningInterval = eveningInterval;

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

    (timesheetsData?.combinedTimesheets || timesheetsData?.combinedTimesheetsForTrials || []).sort(
      (a: { from: string }, b: { from: string }) =>
        parse(a.from, "HH:mm", new Date(day)).getTime() - parse(b.from, "HH:mm", new Date(day)).getTime()
    ).forEach((timesheet: { from: string }) => {
      const tempTime = parse(timesheet.from, "HH:mm", new Date(day));

      if (isWithinInterval(tempTime, currentMorningInterval) && !morning) {
        timeArr.push("Morning");
        morning = true;
        return;
      }
      if (isWithinInterval(tempTime, currentAfternoonInterval) && !afternoon) {
        timeArr.push("Afternoon");
        afternoon = true;
        return;
      }
      if (isWithinInterval(tempTime, currentEveningInterval) && !evening) {
        timeArr.push("Evening");
        evening = true;
        return;
      }
    });

    setTimesOfDay(timeArr);
  };

  useEffect(() => {
    if (timesheetsData) {
      if (differenceInHours(new Date(day), todayUserTimezone) <= hourPrior) {
        setDayInterval({
          currentTime: addHours(todayUserTimezone, hourPrior),
        });
      } else if (differenceInHours(endMonth, new Date(day)) < 24) {
        setDayInterval({ lastTime: endMonth });
      } else {
        setDayInterval({ currentTime: undefined });
      }
      setTimeout(() => scrollToElement("timeOfDay"), 100);
    }
  }, [timesheetsData]);

  useEffect(() => {
    if (timeOfDayInterval.start && timeOfDayInterval.end) {
      const availableSlots: AvailableTime[] = [];

      (timesheetsData?.combinedTimesheets || timesheetsData?.combinedTimesheetsForTrials || []).forEach(
        (timesheet: { from: string; reserved: boolean; mentors: { id: string }[] }) => {
          const tempTime = parse(timesheet.from, "HH:mm", new Date(day));

          if (isWithinInterval(tempTime, timeOfDayInterval) && !timesheet.reserved) {
            availableSlots.push({
              time: timesheet.from,
              reserved: timesheet.reserved,
              mentorId: timesheet.mentors && timesheet.mentors[0].id,
            });
          }
        }
      );

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
