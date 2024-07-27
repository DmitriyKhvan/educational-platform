import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { timeOptions } from '@/pages/mentors/availability/lib/time-options';

export const timeGroups = (availabilities, day) => {
  const timeOfDayInterval = availabilities
    .filter((el) => {
      return el.day === day;
    })
    .map((slot) => {
      return {
        from: formatTimeToSeconds(slot.slots[0].from),
        to: formatTimeToSeconds(slot.slots[0].to),
      };
    });

  const timeOfDayIntervalInverse =
    timeOfDayInterval.length && timeOfDayInterval[0].from !== 0
      ? [{ from: 0, to: timeOfDayInterval[0]?.from }]
      : [];

  for (let i = 0; i < timeOfDayInterval.length; i++) {
    const from = timeOfDayInterval[i].to;
    const to = timeOfDayInterval[i + 1] ? timeOfDayInterval[i + 1].from : 84600;

    timeOfDayIntervalInverse.push({ from, to });
  }

  const timeGroups = [];

  for (let i = 0; i < timeOfDayIntervalInverse.length; i++) {
    const tempArr = timeOptions.filter((time) => {
      return (
        time.value >= timeOfDayIntervalInverse[i].from &&
        time.value <= timeOfDayIntervalInverse[i].to
      );
    });

    timeGroups.push(tempArr);
  }

  return timeGroups.length ? timeGroups : [[...timeOptions]];
};
