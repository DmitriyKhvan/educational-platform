import type { TimeOption } from '@/types';
import { addMinutes, format, startOfDay } from 'date-fns';

export const timeOptions: TimeOption[] = Array.from({ length: 48 }, (_, i) => {
  const temp = addMinutes(startOfDay(new Date()), i * 30);
  return {
    value: 1800 * i,
    label: format(temp, 'hh:mm aa'),
  };
});
