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
  const { user } = useAuth();
  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log('exception', exception);
  console.log('new Date(exception?.date)', new Date(exception?.date));

  const utcDateFrom = `${format(new Date(Number(exception?.date)), 'yyyy-MM-dd')}T${slot.from}:00Z`;
  console.log('utcDateFrom', utcDateFrom);

  return (
    <AdaptiveDialog
      button={
        <button type="button" className="flex w-[90%]">
          <span className="basis-[45%] text-left">
            {/* {format(parse(exception.date, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy')} */}
            {format(toZonedTime(new Date(Number(exception?.date)), 'UTC'), 'dd MMM yyyy')}
          </span>
          {slot && (
            <span className="basis-[55%] text-left">
              <span>
                {format(toZonedTime(new Date(utcDateFrom), userTimezone), 'HH:mm', {
                  timeZone: userTimezone,
                })}
              </span>{' '}
              {/* - <span>{formatTime(formatTimeToSeconds(slot.from), 'hh:mm a')}</span> -{' '}
              <span>{formatTime(formatTimeToSeconds(slot.to), 'hh:mm a')}</span> */}
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
