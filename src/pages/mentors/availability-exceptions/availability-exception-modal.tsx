import { AvailabilityExceptionPicker } from '@/pages/mentors/availability-exceptions/availability-exception-picker';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import type { Exception } from '@/types';
import type { ExceptionDateSlot } from '@/types/types.generated';
import { parse } from 'date-fns';
import { format } from 'date-fns-tz';
import { formatTime } from '../availability/lib/format-time';
import { formatTimeToSeconds } from '../availability/lib/format-time-to-seconds';
import { useState } from 'react';

export const AvailabilityExceptionModal = ({
  exception,
  slot,
  onSubmit,
  disabledDates,
}: {
  exception: Exception;
  slot?: ExceptionDateSlot;
  onSubmit: (exception: Exception) => void;
  disabledDates: Date[];
}) => {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);

  return (
    <AdaptiveDialog
      open={openCalendar}
      setOpen={setOpenCalendar}
      button={
        <button type="button" className="flex w-[90%]">
          <span className="basis-[45%] text-left">
            {format(parse(exception.date, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy')}
            {/* {exception?.date} */}
          </span>
          {slot && (
            <span className="basis-[55%] text-left">
              {/* <span>{slot.from}</span> - <span>{slot.to}</span> */}
              <span>{formatTime(formatTimeToSeconds(slot.from), 'hh:mm a')}</span> -{' '}
              <span>{formatTime(formatTimeToSeconds(slot.to), 'hh:mm a')}</span>
            </span>
          )}
        </button>
      }
    >
      <AvailabilityExceptionPicker
        oldException={exception}
        onSubmit={onSubmit}
        setOpenCalendar={setOpenCalendar}
        disabledDates={disabledDates.filter((date) => {
          return date.toString() !== parse(exception.date, 'yyyy-MM-dd', new Date()).toString();
        })}
        disableSave={undefined}
      />
    </AdaptiveDialog>
  );
};
