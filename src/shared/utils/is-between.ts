import { addMinutes, isWithinInterval, subMinutes } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface IsBetweenParams {
  dateStart: Date | number;
  duration: number;
  userTimezone: string;
}

export const isBetween = ({ dateStart, duration, userTimezone }: IsBetweenParams): boolean => {
  const dateLesson = toZonedTime(dateStart, userTimezone);
  const today = toZonedTime(new Date(), userTimezone);

  const tenMinutesBeforeStart = subMinutes(dateLesson, 10);
  const beforeEndLesson = addMinutes(dateLesson, duration);

  const isBetween = isWithinInterval(today, {
    start: tenMinutesBeforeStart,
    end: beforeEndLesson,
  });

  return isBetween;
};
