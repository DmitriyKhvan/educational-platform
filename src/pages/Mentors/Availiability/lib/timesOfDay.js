import { formatTimeToSeconds } from './formatTimeToSeconds';
import { timeOptions } from './timeOptions';

export const timesOfDay = (availabilities, day) => {
  // доступные временные слоты
  let timeOptionsSort = [...timeOptions];

  availabilities
    .filter((el) => {
      return el.day === day;
    })
    .map((slot) => {
      return {
        from: formatTimeToSeconds(slot.slots[0].from),
        to: formatTimeToSeconds(slot.slots[0].to),
      };
    })
    .forEach((slot) => {
      timeOptionsSort = timeOptionsSort.filter(
        (time) => time.value <= slot.from || time.value >= slot.to,
      );
    });

  return timeOptionsSort;
};
