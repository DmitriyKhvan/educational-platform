import { addMinutes, isWithinInterval, subMinutes } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const isBetween = ({ dateStart, duration, userTimezone }) => {
  const dateLesson = utcToZonedTime(dateStart, userTimezone);

  const today = utcToZonedTime(new Date(), userTimezone);

  const tenMinuteBeforeStart = subMinutes(dateLesson, 10);
  const beforeEndLesson = addMinutes(dateLesson, duration);

  const isBetween = isWithinInterval(today, {
    start: tenMinuteBeforeStart,
    end: beforeEndLesson,
  });

  return isBetween;
};
