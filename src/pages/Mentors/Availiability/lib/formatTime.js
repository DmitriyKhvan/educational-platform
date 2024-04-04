import { format } from 'date-fns';

export const formatTime = (time) => {
  const formattedTime = format(new Date(time * 1000), 'HH:mm');
  return formattedTime;
};
