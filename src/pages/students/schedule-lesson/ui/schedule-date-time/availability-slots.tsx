import Button from '@/components/form/button';
import type { AvailabilitySlot, GroupedAvailabilitySlots } from '@/types/types.generated';
import { format } from 'date-fns-tz';
import { useState } from 'react';
import { HiMiniChevronDown, HiMiniChevronUp } from 'react-icons/hi2';
import { AvailabilitySlotComponent } from './availability-slot';

interface AvailabilitySlotsProps {
  availDate: GroupedAvailabilitySlots;
  last: boolean;
  setChosenDates: React.Dispatch<React.SetStateAction<AvailabilitySlot[]>>;
  chosenDates: AvailabilitySlot[];
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  setRepeat: React.Dispatch<React.SetStateAction<number | boolean | null>>;
  repeat: number | boolean | null;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const AvailabilitySlots: React.FC<AvailabilitySlotsProps> = ({
  availDate,
  last,
  setChosenDates,
  chosenDates,
  setSchedule,
  setRepeat,
  repeat,
  setTabIndex,
}) => {
  const cardSlots = availDate.timeSlots.slice(0, 9);
  const moreSlots = availDate.timeSlots.slice(9);

  const [isMoreSlots, setIsMoreSlots] = useState<boolean>(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-color-dark-purple">
          {format(new Date(availDate.date), 'MMMM d')}
        </h2>
        <span className="text-[13px] font-medium text-gray-300">
          {format(new Date(availDate.date), 'EEEE')}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {cardSlots.map((time) => (
          <AvailabilitySlotComponent
            key={time.from}
            time={time}
            setChosenDates={setChosenDates}
            setSchedule={setSchedule}
            setRepeat={setRepeat}
            repeat={repeat}
            active={chosenDates.some((slot) => slot.date === time.date && slot.from === time.from)}
            setTabIndex={setTabIndex}
          />
        ))}

        {isMoreSlots &&
          moreSlots.map((time) => (
            <AvailabilitySlotComponent
              key={time.from}
              time={time}
              setChosenDates={setChosenDates}
              setSchedule={setSchedule}
              setRepeat={setRepeat}
              repeat={repeat}
              active={chosenDates.some(
                (slot) => slot.date === time.date && slot.from === time.from,
              )}
              setTabIndex={setTabIndex}
            />
          ))}
      </div>

      {availDate.timeSlots.length > 9 && !isMoreSlots && (
        <button
          onClick={() => setIsMoreSlots(true)}
          type="button"
          className="flex items-center justify-center gap-1 w-full h-12 text-[rgba(14,_197,_65,_1)] rounded-lg border border-[rgba(14,_197,_65,_1)]"
        >
          <span className="text-sm">Show all ({moreSlots.length} more)</span>
          <HiMiniChevronDown className="text-lg" />
        </button>
      )}

      {isMoreSlots && (
        <Button
          theme="gray"
          className="flex items-center justify-center gap-1 w-full h-12"
          onClick={() => setIsMoreSlots(false)}
        >
          <span className="text-sm">Hide</span>
          <HiMiniChevronUp className="text-lg" />
        </Button>
      )}

      {!last && <div className="w-full h-[1px] bg-gray-100" />}
    </div>
  );
};
