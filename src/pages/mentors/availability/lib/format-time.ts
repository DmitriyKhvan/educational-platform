import { format, toZonedTime } from 'date-fns-tz';

export const formatTime = (time: number, timeFormat = 'HH:mm') => {
  const formattedTime = format(toZonedTime(new Date(time * 1000), 'UTC'), timeFormat, {
    timeZone: 'UTC',
  });
  return formattedTime;
};
