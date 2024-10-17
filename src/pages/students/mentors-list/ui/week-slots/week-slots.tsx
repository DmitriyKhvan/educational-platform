import { useAuth } from '@/app/providers/auth-provider';
import { useAvailabilitySlotsLazyQuery } from '@/shared/apollo/queries/timesheets/availability-slots.generated';
import notify from '@/shared/utils/notify';
import type { GroupedAvailabilitySlots, Mentor } from '@/types/types.generated';
import { add, set } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import type { EmblaOptionsType } from 'embla-carousel';
import { useCallback, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { EmblaCarousel } from './embla-carousel';

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
    const startTime = format(rangeStart, 'yyyy-MM-dd HH:mm:ss', { timeZone: userTimezone });
    const endTime = format(
      set(rangeEnd, { hours: 23, minutes: 59, seconds: 59 }),
      'yyyy-MM-dd HH:mm:ss',
      { timeZone: userTimezone },
    );

    try {
      const response = await availabilitySlots({
        variables: {
          mentorId: mentor.id,
          timezone: userTimezone,
          rangeStart: startTime,
          rangeEnd: endTime,
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

    const today = toZonedTime(new Date(), userTimezone);
    const rangeStart =
      process.env.REACT_APP_PRODUCTION === 'false' ? today : add(today, { days: 2 });

    // const rangeStart = toZonedTime(new Date(), userTimezone); // today
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
