import SelectLessonDatePopover from '@/entities/select-lesson-date-popover/ui/select-lesson-date-popover';
import { cn } from '@/shared/utils/functions';
import type { AvailabilitySlot } from '@/types/types.generated';

interface AvailabilitySlotProps {
  time: AvailabilitySlot;
  setChosenDates: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  setRepeat: React.Dispatch<React.SetStateAction<number | null>>;
  active?: boolean;
}

export const AvailabilitySlotComponent: React.FC<AvailabilitySlotProps> = ({
  time,
  setChosenDates,
  setSchedule,
  setRepeat,
  active,
}) => {
  return (
    <SelectLessonDatePopover
      slot={time}
      setSchedule={setSchedule}
      setRepeat={setRepeat}
      setChosenDates={setChosenDates}
      btn={
        <button
          onClick={() => setChosenDates([time])}
          type="button"
          className={cn(
            'w-full px-2 rounded-lg bg-[rgba(14,_197,_65,_0.1)] h-10 text-[15px] font-medium text-[rgba(14,_197,_65,_1)]',
            active && 'bg-[rgba(14,_197,_65,_1)] text-white',
          )}
        >
          {time.from}
        </button>
      }
    />
  );
};
