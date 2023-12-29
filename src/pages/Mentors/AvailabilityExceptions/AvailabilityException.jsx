import { DatePicker } from '@tremor/react';

import { AvailabilityExceptionSlot } from './AvailabilityExceptionSlot';

export const AvailabilityException = ({
  availabilityExceptionSlots,
  exception,
}) => {
  return (
    <>
      <div>
        <DatePicker className="max-w-sm rounded border mb-4" />

        {exception.slots.map((slot) => {
          return (
            <AvailabilityExceptionSlot
              key={slot.id}
              slot={slot}
              exception={exception}
              availabilityExceptionSlots={availabilityExceptionSlots}
            />
          );
        })}
      </div>
      <div className="divider "></div>
    </>
  );
};
