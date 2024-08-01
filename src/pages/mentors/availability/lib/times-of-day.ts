import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { timeOptions } from '@/pages/mentors/availability/lib/time-options';

import type { TimesheetSlot } from '@/types/types.generated';

export const timesOfDay = (availabilities: TimesheetSlot[], day: string) => {
  let timeOptionsSort = [...timeOptions];

  const daySlots = availabilities
    .filter((el) => el.day === day)
    .map((slot) => ({
      from: formatTimeToSeconds(slot.from),
      to: formatTimeToSeconds(slot.to),
    }));

  // Remove time options that fall within unavailable slots
  for (const slot of daySlots) {
    timeOptionsSort = timeOptionsSort.filter((time) => {
      return time.value < slot.from || time.value >= slot.to;
    });
  }

  return timeOptionsSort;
};
