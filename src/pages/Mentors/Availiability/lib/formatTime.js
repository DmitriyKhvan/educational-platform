import { format, utcToZonedTime } from 'date-fns-tz';

export const formatTime = (time) => {
  const formattedTime = format(
    utcToZonedTime(new Date(time * 1000), 'UTC'),
    'HH:mm',
    {
      timeZone: 'UTC',
    },
  );
  return formattedTime;
};
