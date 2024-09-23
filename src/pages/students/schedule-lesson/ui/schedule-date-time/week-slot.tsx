import { format } from 'date-fns-tz';
import type { WeekRanges } from './schedule-date-time';

export const WeekSlot = ({ slot, index }: { slot: WeekRanges; index: number }) => {
  return (
    <div className="flex flex-col items-center py-3 px-1.5 rounded-lg bg-color-purple text-white">
      <span className="text-[13px] font-semibold">Week {index + 1}</span>
      <span className="text-xs">
        {format(new Date(slot.rangeStart), 'd')} - {format(new Date(slot.rangeEnd), 'd MMM')}
      </span>
    </div>
  );
};
