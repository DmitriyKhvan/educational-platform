import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { type TimeOption, timeOptions } from '@/pages/mentors/availability/lib/time-options';
import type { Availability } from '@/types';
type TimeSlot = {
  from: number;
  to: number;
};

export const timeGroups = (availabilities: Availability[], day: string): TimeOption[][] => {
  const timeOfDayInterval = availabilities
    .filter((el) => el.day === day)
    .map((slot) => ({
      from: formatTimeToSeconds(slot.slots[0].from),
      to: formatTimeToSeconds(slot.slots[0].to),
    }));

  const timeOfDayIntervalInverse: TimeSlot[] =
    timeOfDayInterval.length && timeOfDayInterval[0].from !== 0
      ? [{ from: 0, to: timeOfDayInterval[0].from }]
      : [];

  for (let i = 0; i < timeOfDayInterval.length; i++) {
    const from = timeOfDayInterval[i].to;
    const to = timeOfDayInterval[i + 1] ? timeOfDayInterval[i + 1].from : 84600;

    timeOfDayIntervalInverse.push({ from, to });
  }

  const timeGroups: TimeOption[][] = [];

  for (let i = 0; i < timeOfDayIntervalInverse.length; i++) {
    const tempArr = timeOptions.filter(
      (time) =>
        time.value >= timeOfDayIntervalInverse[i].from &&
        time.value <= timeOfDayIntervalInverse[i].to,
    );

    timeGroups.push(tempArr);
  }

  return timeGroups.length ? timeGroups : [[...timeOptions]];
};
