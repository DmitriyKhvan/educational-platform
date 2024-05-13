import { format, utcToZonedTime } from 'date-fns-tz';

export const formatTime = (time, timeFormat = 'HH:mm') => {
  const formattedTime = format(
    utcToZonedTime(new Date(time * 1000), 'UTC'),
    timeFormat,
    {
      timeZone: 'UTC',
    },
  );
  return formattedTime;
};
