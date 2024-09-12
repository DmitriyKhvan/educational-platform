import type { WeekRanges } from './schedule-date-time';

export const WeekSlot = ({ slot, index }: { slot: WeekRanges; index: number }) => {
  return (
    <div className="flex flex-col items-center">
      <span>Week {index + 1}</span>
      <span>
        {slot.rangeStart} - {slot.rangeEnd}
      </span>
    </div>
  );
};
