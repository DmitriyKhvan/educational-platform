import type { GroupedAvailabilitySlots, Mentor } from '@/types/types.generated';
import { EmblaCarousel } from './embla-carousel';
import type { EmblaOptionsType } from 'embla-carousel';
import { useCallback, useEffect, useState } from 'react';
import { add } from 'date-fns';
import { useAvailabilitySlotsLazyQuery } from '@/shared/apollo/queries/timesheets/availability-slots.generated';
import { useAuth } from '@/app/providers/auth-provider';
import { format, toZonedTime } from 'date-fns-tz';
import notify from '@/shared/utils/notify';
import { useMediaQuery } from 'react-responsive';

export const WeekSlots = ({
  mentor,
  disableMentor,
}: { mentor: Mentor; disableMentor: boolean }) => {
  const isTablet = useMediaQuery({ maxWidth: 1024 });
  const isDesktop = useMediaQuery({ minWidth: 1025, maxWidth: 1280 });
  const WEEK_DAYS = isTablet ? 4 : isDesktop ? 6 : 7;

  const { user } = useAuth();
  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [availabilitySlots] = useAvailabilitySlotsLazyQuery();
  const options: EmblaOptionsType = { slidesToScroll: 'auto' };
  const [slides, setSlides] = useState<string[]>([]);
  const [slots, setSlots] = useState<GroupedAvailabilitySlots[]>([]);

  const fetchAvailabilitySlots = async (rangeStart: Date, rangeEnd: Date) => {
    try {
      const response = await availabilitySlots({
        variables: {
          mentorId: mentor.id,
          timezone: userTimezone,
          rangeStart: format(rangeStart, 'yyyy-MM-dd', { timeZone: userTimezone }),
          rangeEnd: format(rangeEnd, 'yyyy-MM-dd', { timeZone: userTimezone }),
          duration: 25,
        },
      });

      if (response.data) {
        setSlots(
          response.data.availabilitySlots?.filter(
            (slot) => slot !== null,
          ) as GroupedAvailabilitySlots[],
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
  const nextWeekSlots = useCallback(async (stepCarousel: number) => {
    const datesArray: string[] = [];
    const countDays = WEEK_DAYS * stepCarousel;
    const rangeStart = toZonedTime(new Date(), userTimezone); // today
    const rangeEnd = add(rangeStart, { days: countDays - 1 });
    const startDay = add(rangeStart, { days: countDays - WEEK_DAYS }); // 5 or 7 days ago from the end date

    if (!disableMentor) await fetchAvailabilitySlots(rangeStart, rangeEnd);

    // generate dates for 5 or7 days
    for (let i = 0; i < WEEK_DAYS; i++) {
      const nextDate = format(add(startDay, { days: i }), 'yyyy-MM-dd', {
        timeZone: userTimezone,
      });
      datesArray.push(nextDate);
    }
    setSlides((prev) => [...prev, ...datesArray]);
  }, []);

  return (
    <EmblaCarousel
      slides={slides}
      slots={slots}
      options={options}
      nextWeekSlots={nextWeekSlots}
      weekDays={WEEK_DAYS}
      disableMentor={disableMentor}
    />
  );
};
