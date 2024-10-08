import { toZonedTime } from 'date-fns-tz';

interface IsWithinHoursParams {
  dateEnd: Date | number;
  dateStart: Date | number;
  hours: number;
  userTimezone: string;
}

export const isWithinHours = ({
  dateEnd,
  dateStart,
  hours,
  userTimezone,
}: IsWithinHoursParams): boolean => {
  const endZonedTime = toZonedTime(dateEnd, userTimezone).getTime();
  const startZonedTime = toZonedTime(dateStart, userTimezone).getTime();

  return endZonedTime - startZonedTime <= hours * 60 * 60 * 1000;
};
