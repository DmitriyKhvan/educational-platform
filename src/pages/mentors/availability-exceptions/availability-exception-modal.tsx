import { useAuth } from '@/app/providers/auth-provider';
import { AvailabilityExceptionPicker } from '@/pages/mentors/availability-exceptions/availability-exception-picker';
import { formatTime } from '@/pages/mentors/availability/lib/format-time';
import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import type { Exception, Slot } from '@/types';
import { parse } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';

export const AvailabilityExceptionModal = ({
  availabilityExceptions,
  exception,
  slot,
  onSubmit,
  disabledDates,
}: {
  availabilityExceptions: Exception[];
  exception: Exception;
  slot: Slot;
  onSubmit: (exception: Exception) => void;
  disabledDates: Date[];
}) => {
  console.log('disabledDates', disabledDates);

  return (
    <AdaptiveDialog
      button={
        <button type="button" className="flex w-[90%]">
          <span className="basis-[45%] text-left">
            {/* {format(parse(exception.date, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy')} */}
            {exception?.date}
          </span>
          {slot && (
            <span className="basis-[55%] text-left">
              <span>{slot.from}</span> - <span>{slot.to}</span>
            </span>
          )}
        </button>
      }
    >
      <AvailabilityExceptionPicker
        oldException={exception}
        onSubmit={onSubmit}
        disabledDates={disabledDates.filter((date) => {
          return date.toString() !== parse(exception.date, 'yyyy-MM-dd', new Date()).toString();
        })}
        availabilityExceptions={availabilityExceptions}
        disableSave={undefined}
      />
    </AdaptiveDialog>
  );
};
