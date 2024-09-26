import { format } from 'date-fns-tz';
import type { WeekRanges } from './schedule-date-time';
import { cn } from '@/shared/utils/functions';

export const WeekSlot = ({
  slot,
  index,
  active,
}: { slot: WeekRanges; index: number; active: boolean }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center py-3 px-1.5 rounded-lg border border-gray-200',
        active && 'bg-color-purple',
      )}
    >
      <span
        className={cn('text-[13px] font-semibold text-color-dark-purple', active && 'text-white')}
      >
        Week {index + 1}
      </span>
      <span className={cn('text-xs text-gray-400', active && 'text-white')}>
        {format(new Date(slot.rangeStart), 'd')} - {format(new Date(slot.rangeEnd), 'd MMM')}
      </span>
    </div>
  );
};
