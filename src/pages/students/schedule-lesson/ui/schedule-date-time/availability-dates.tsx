import type { AvailabilitySlot, GroupedAvailabilitySlots } from '@/types/types.generated';

import Button from '@/components/form/button';
import { useState } from 'react';
import { AvailabilitySlots } from './availability-slots';

interface AvailabilityDatesProps {
  availDates: GroupedAvailabilitySlots[];
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  schedule: AvailabilitySlot | undefined;
  setRepeat: React.Dispatch<React.SetStateAction<number | boolean | null>>;
  repeat: number | boolean | null;
}

export const AvailabilityDates: React.FC<AvailabilityDatesProps> = ({
  availDates,
  setTabIndex,
  setSchedule,
  setRepeat,
  repeat,
  schedule,
}) => {
  const [chosenDates, setChosenDates] = useState<AvailabilitySlot[]>([]);
  // const scheduleLesson = () => {
  //   console.log('slot', slot);
  //   if (slot) {
  //     setSchedule(slot);
  //     setTabIndex(3);
  //   }
  // };

  return (
    <div className="mt-5 space-y-4">
      {availDates.map((availDate, index) => (
        <AvailabilitySlots
          key={availDate.date}
          availDate={availDate}
          last={index === availDates.length - 1}
          setChosenDates={setChosenDates}
          chosenDates={chosenDates}
          setSchedule={setSchedule}
          setRepeat={setRepeat}
          repeat={repeat}
          setTabIndex={setTabIndex}
        />
      ))}

      {schedule && (
        <Button onClick={() => setTabIndex(3)} className="w-full sticky bottom-0">
          Book selected lessons
        </Button>
      )}
    </div>
  );
};
