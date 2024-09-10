import type { AvailabilitySlot, Mentor } from '@/types/types.generated';
import { EmblaCarousel } from './embla-carousel';
import type { EmblaOptionsType } from 'embla-carousel';
import { useCallback, useEffect, useState } from 'react';
import { add } from 'date-fns';
import { useAvailabilitySlotsLazyQuery } from '@/shared/apollo/queries/timesheets/availability-slots.generated';
import { useAuth } from '@/app/providers/auth-provider';
import { format, toZonedTime } from 'date-fns-tz';
import notify from '@/shared/utils/notify';

export const WeekSlots = ({ mentor }: { mentor: Mentor }) => {
  const { user } = useAuth();
  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [availabilitySlots] = useAvailabilitySlotsLazyQuery();
  const options: EmblaOptionsType = { slidesToScroll: 'auto' };
  const [slides, setSlides] = useState<string[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);

  const fetchAvailabilitySlots = async (rangeStart: Date, rangeEnd: Date) => {
    try {
      const response = await availabilitySlots({
        variables: {
          mentorId: mentor.id,
          timezone: userTimezone,
          rangeStart: format(rangeStart, 'yyyy-MM-dd', { timeZone: userTimezone }),
          rangeEnd: format(rangeEnd, 'yyyy-MM-dd', { timeZone: userTimezone }),
          duration: 30,
        },
      });

      if (response.data) {
        setSlots(
          response.data.availabilitySlots.filter((slot) => slot !== null) as AvailabilitySlot[],
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        notify(error.message, 'error');
      }
    }
  };

  useEffect(() => {
    nextWeekSlots(1);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const nextWeekSlots = useCallback((count: number) => {
    const datesArray: string[] = [];
    const countDays = 7 * count;
    const rangeStart = toZonedTime(new Date(), userTimezone);
    const rangeEnd = add(rangeStart, { days: countDays });

    fetchAvailabilitySlots(rangeStart, rangeEnd);

    for (let i = 0; i < countDays; i++) {
      const nextDate = format(add(rangeStart, { days: i }), 'yyyy-MM-dd', {
        timeZone: userTimezone,
      });

      datesArray.push(nextDate);
    }
    setSlides(datesArray);
  }, []);

  return (
    <EmblaCarousel slides={slides} slots={slots} options={options} nextWeekSlots={nextWeekSlots} />
  );
};
