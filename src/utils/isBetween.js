import { addMinutes, isWithinInterval, subMinutes } from 'date-fns';

export const isBetween = (date, duration) => {
  const dateLesson = new Date(date);
  const today = new Date();
  const tenMinuteBeforeStart = subMinutes(dateLesson, 10);
  const beforeEndLesson = addMinutes(dateLesson, duration);

  const isBetween = isWithinInterval(today, {
    start: tenMinuteBeforeStart,
    end: beforeEndLesson,
  });

  return isBetween;
};
