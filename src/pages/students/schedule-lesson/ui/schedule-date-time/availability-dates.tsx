import type { AvailabilitySlot, GroupedAvailabilitySlots } from '@/types/types.generated';

import { AvailabilitySlots } from './availability-slots';
import { useState } from 'react';
import Button from '@/components/form/button';

interface AvailabilityDatesProps {
  availDates: GroupedAvailabilitySlots[];
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
}

export const AvailabilityDates: React.FC<AvailabilityDatesProps> = ({
  availDates,
  setTabIndex,
  setSchedule,
}) => {
  const [slot, setSlot] = useState<AvailabilitySlot>();
  const scheduleLesson = () => {
    console.log('slot', slot);
    if (slot) {
      setSchedule(slot);
      setTabIndex(3);
    }
  };

  return (
    <div className="mt-5 space-y-4">
      {availDates.map((availDate, index) => (
        <AvailabilitySlots
          availDate={availDate}
          last={index === availDates.length - 1}
          key={availDate.date}
          setSlot={setSlot}
          slot={slot}
        />
      ))}

      {slot && (
        <Button onClick={scheduleLesson} className="w-full sticky bottom-0">
          Book selected lessons
        </Button>
      )}
    </div>
  );
};
