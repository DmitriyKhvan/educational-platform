import type { MentorAvailabilityType } from '@/shared/constants/global';
import type { Duration } from 'date-fns';
import type { PackageSubscription } from './types.generated';

export const EventType = {
  REGULAR: 'regular',
  TRIAL: 'trial',
  EXCEPTION: 'exception',
  LESSON: 'lesson',
};

export type EventType = (typeof EventType)[keyof typeof EventType];

export interface RecurringEvent {
  day: string;
  from: string;
  to: string;
}

export interface RRuleCommon {
  freq: string;
  byweekday: string[];
  dtstart: string;
}

export interface RenderedEvent {
  id?: string | number;
  title?: string;
  rrule?: RRuleCommon;
  type?: EventType;
  view?: string;
  start: Date;
  end: Date;
  duration?: Duration;
  allDay?: boolean;
  display?: string;
  resource?: CalendarAppointment;
}
export interface WeeklyViewEvent {
  id?: string;
  title?: string;
  rrule?: RRuleCommon;
  view: string;
  type: EventType;
  duration?: Duration;
  allDay?: boolean;
  display?: string;
  resource?: CalendarAppointment;
}

export interface MonthlyViewEvent {
  id?: string;
  title?: string;
  view?: string;
  day?: string;
  regular?: RecurringEvent[];
  trial?: RecurringEvent[];
  rrule?: RRuleCommon;
  exdate?: string[];
  exception?: { from: string; to: string }[];
  allDay?: boolean;
  start?: Date;
  date?: string;
  resource?: CalendarAppointment;
}

interface Student {
  firstName: string;
  lastName: string;
  langLevel: string;
}

interface EventDate {
  startAt: Date;
  duration: number;
}
export interface CalendarAppointment {
  startAt: Date;
  end_at: Date;
  student: Student;
  eventDate: EventDate;
  packageSubscription: PackageSubscription;
  isTrial: boolean;
  courseId: string;
}

export interface RenderSingleEventsResult {
  lessonEvents: RenderedEvent[];
  exceptionsMonthlyEvents: MonthlyViewEvent[];
  exceptionsWeeklyEvents: RenderedEvent[];
}
export interface RenderRecurEventsResult {
  monthlyViewEvents: MonthlyViewEvent[];
  weeklyViewEvents: WeeklyViewEvent[];
}

interface Appointment {
  lessons: {
    startAt: string;
    duration: number;
    isTrial: boolean;
    student: {
      firstName: string;
      lastName: string;
    };
  }[];
}

export interface RenderSingleEventsParams {
  appointments: Appointment;
  exceptions: Exception[];
  monthlyViewEvents: MonthlyViewEvent[];
  userTimezone: string;
}
export interface RenderRecurEventsResult {
  monthlyViewEvents: MonthlyViewEvent[];
  weeklyViewEvents: WeeklyViewEvent[];
}

export interface Slot {
  from: string;
  to: string;
}

export interface SlotToSave {
  day: string;
  slots: { from: string; to: string }[];
  trialTimesheet: boolean;
}

export interface Availability {
  day: string;
  slots: Slot[];
}

export interface MentorInfo {
  id: string;
  mentorAvailability: MentorAvailabilityType;
  availabilities: {
    regular: Availability[];
    trial: Availability[];
  };
  exceptionDates: Exception[];
}

export interface Exception {
  date: string;
  from?: string;
  to?: string;
}

export interface GatherAvailabilities {
  [key: string]: Availability[];
}

export interface ErrorExceptionalDates {
  regularLessons?: number;
  trialLessons?: number;
}
