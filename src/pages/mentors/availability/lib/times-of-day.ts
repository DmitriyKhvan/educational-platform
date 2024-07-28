import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { timeOptions } from '@/pages/mentors/availability/lib/time-options';
import type { Availability } from '@/types';

export const timesOfDay = (availabilities: Availability[], day: string) => {
  let timeOptionsSort = [...timeOptions];

  const daySlots = availabilities
    .filter((el) => el.day === day)
    .map((slot) => ({
      from: formatTimeToSeconds(slot.slots[0].from),
      to: formatTimeToSeconds(slot.slots[0].to),
    }));

  // Remove time options that fall within unavailable slots
  for (const slot of daySlots) {
    timeOptionsSort = timeOptionsSort.filter((time) => {
      return time.value < slot.from || time.value >= slot.to;
    });
  }

  return timeOptionsSort;
};
