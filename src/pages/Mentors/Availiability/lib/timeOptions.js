import { addMinutes, startOfDay, format } from 'date-fns';

export const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const temp = addMinutes(startOfDay(new Date()), i * 30);
  return {
    value: 1800 * i,
    label: format(temp, 'hh:mm aa'),
  };
});
