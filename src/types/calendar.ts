import type { EventInput } from '@fullcalendar/core';
import type { Mentor, PackageSubscription, Student } from './types.generated';

export interface Course {
  title: string;
  id: string;
}

export type CalendarEvent = EventInput | Event;

interface Event {
  id: string;
  startAt: string;
  duration: number | null | undefined;
  playground: string;
  type: string;
  mentor?: Mentor;
  student: Student;
  isTrial: boolean;
  status: string;
  packageSubscription: PackageSubscription;
  topic: string;
  languageLevel: string;
  cancelledAt?: string;
  cancelledBy?: string;
}

export interface CalendarEventProcessed extends EventInput {
  playground: string;
  lesson: string;
  courseId: string;
  startAt: Date;
  end_at: Date;
  type: string;
  mentor?: Mentor;
  eventDate: CalendarEvent;
  student: Student;
  isTrial: boolean;
  status: string;
  packageSubscription: PackageSubscription;
  topic: string;
  languageLevel: string;
  duration: number;
}

export interface CalendarEventsSorted {
  dateTime: {
    startTime: string;
    endTime: string;
    date: string;
  };
  sessionTime: Date;
  mentor: string;
  resource: CalendarEvent;
}

export interface SortCalendarEventsResult {
  tablularEventData: CalendarEventsSorted[];
  calendarEvents: CalendarEventProcessed[];
}
