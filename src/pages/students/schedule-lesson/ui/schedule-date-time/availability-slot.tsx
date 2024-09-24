import { cn } from '@/shared/utils/functions';
import type { AvailabilitySlot } from '@/types/types.generated';

export const AvailabilitySlotComponent = ({
  time,
  setSlot,
  slot,
}: {
  time: AvailabilitySlot;
  slot?: AvailabilitySlot;
  setSlot: (slot: AvailabilitySlot) => void;
}) => {
  return (
    <button
      onClick={() => setSlot(time)}
      type="button"
      className={cn(
        'px-2 rounded-lg bg-[rgba(14,_197,_65,_0.1)] h-10 text-[15px] font-medium text-[rgba(14,_197,_65,_1)]',
        slot?.date === time?.date &&
          slot?.from === time?.from &&
          'bg-[rgba(14,_197,_65,_1)] text-white',
      )}
    >
      {time.from}
    </button>
  );
};
