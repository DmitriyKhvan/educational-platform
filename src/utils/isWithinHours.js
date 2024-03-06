import { utcToZonedTime } from 'date-fns-tz';
import { useAuth } from 'src/modules/auth';

export const isWithinHours = ({ dateEnd, dateStart, hours, userTimezone }) => {
  const isWithinHours =
    utcToZonedTime(dateEnd, userTimezone) -
      utcToZonedTime(dateStart, userTimezone) <=
    hours * 60 * 60 * 1000;

  return isWithinHours;
};
