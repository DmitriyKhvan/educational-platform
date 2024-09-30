import type { AvailabilitySlot, GroupedAvailabilitySlots } from '@/types/types.generated';

import { AvailabilitySlots } from './availability-slots';
import { useState } from 'react';
import Button from '@/components/form/button';

interface AvailabilityDatesProps {
  availDates: GroupedAvailabilitySlots[];
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  schedule: AvailabilitySlot | undefined;
  setRepeat: React.Dispatch<React.SetStateAction<number | null>>;
}

export const AvailabilityDates: React.FC<AvailabilityDatesProps> = ({
  availDates,
  setTabIndex,
  setSchedule,
  setRepeat,
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
