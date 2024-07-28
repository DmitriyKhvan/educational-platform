import type { Mentor, Timesheet } from '@/types/types.generated';
import { type Dispatch, type SetStateAction, createContext } from 'react';

interface TimeOfDayInterval {
  start: string;
  end: string;
}

interface AvailableTime {
  time: string;
  reserved: boolean;
  mentorId: string;
}

export interface ScheduleContextType {
  userTimezone: string;
  setTabIndex: Dispatch<SetStateAction<number>>;
  setSchedule: Dispatch<SetStateAction<string>>;
  selectedMentor: { id: string } | null;
  duration?: number;
  setDay: Dispatch<SetStateAction<Date>>;
  day: Date;
  setTimesOfDay: Dispatch<SetStateAction<string[]>>;
  timesOfDay: string[];
  setTimeOfDayInterval: Dispatch<SetStateAction<TimeOfDayInterval>>;
  timeOfDayInterval: TimeOfDayInterval;
  setAvailableTimes: Dispatch<SetStateAction<AvailableTime[]>>;
  availableTimes: AvailableTime[];
  getTimesheetsData: () => void;
  timesheetsLoading: boolean;
  timesheetsData: Timesheet;
  dayClicked: number | null;
  setDayClicked: Dispatch<SetStateAction<number | null>>;
  timeClicked: string | null;
  setTimeClicked: Dispatch<SetStateAction<string | null>>;
  todayUserTimezone: Date;
  morningInterval: { start: Date; end: Date };
  afternoonInterval: { start: Date; end: Date };
  eveningInterval: { start: Date; end: Date };
  endMonth: Date;
  isToday: boolean;
  resetAll: () => void;
  setSelectMentor?: Dispatch<SetStateAction<Mentor | undefined>>;
  hourPrior: number;
}

export const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);
