import { addWeeks, endOfWeek, isBefore, startOfWeek } from 'date-fns';
import { format } from 'date-fns-tz';
import { useCallback, useEffect, useState } from 'react';
import { EmblaCarousel } from './embla-carousel';
import type { EmblaOptionsType } from 'embla-carousel';
import { AvailabilityDates } from './availability-dates';
import { useAvailabilitySlotsLazyQuery } from '@/shared/apollo/queries/timesheets/availability-slots.generated';
import type {
  AvailabilitySlot,
  GroupedAvailabilitySlots,
  Mentor,
  PackageSubscription,
} from '@/types/types.generated';
import { useAuth } from '@/app/providers/auth-provider';
import notify from '@/shared/utils/notify';

export interface WeekRanges {
  rangeStart: string;
  rangeEnd: string;
}

export interface ScheduleDateTimeProps {
  mentor: Mentor;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  setRepeat: React.Dispatch<React.SetStateAction<number | null>>;
  schedule: AvailabilitySlot | undefined;
  plan: PackageSubscription | undefined;
}

export const ScheduleDateTime: React.FC<ScheduleDateTimeProps> = ({
  mentor,
  setTabIndex,
  setSchedule,
  schedule,
  setRepeat,
  plan,
}) => {
  const options: EmblaOptionsType = { containScroll: 'keepSnaps', slidesToScroll: 'auto' };
  const [weekRanges, setWeekRanges] = useState<WeekRanges[]>([]);
  const [availabilitySlots] = useAvailabilitySlotsLazyQuery();
  const { user } = useAuth();
  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [availDates, setAvailDates] = useState<GroupedAvailabilitySlots[]>([]);

  const fetchAvailabilitySlots = async (rangeStart: string, rangeEnd: string) => {
    try {
      const response = await availabilitySlots({
        variables: {
          mentorId: mentor.id,
          timezone: userTimezone,
          rangeStart,
          rangeEnd,
          duration: plan?.package?.sessionTime ?? 25,
        },
      });

      if (response.data) {
        setAvailDates(
          response.data.availabilitySlots.filter(
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

  console.log('weekRanges', weekRanges);

  useEffect(() => {
    generateWeekRanges(4);
  }, []);

  const generateWeekRanges = useCallback(
    (weeksCount: number) => {
      const curWeekRanges: WeekRanges[] = [];

      // Начальная дата — текущая
      let currentDate =
        weekRanges.length > 0
          ? addWeeks(new Date(weekRanges[weekRanges.length - 1].rangeStart), 1)
          : new Date();

      for (let i = 0; i < weeksCount; i++) {
        // Определяем понедельник и воскресенье для текущей недели
        let rangeStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Понедельник
        let rangeEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Воскресенье

        // Если текущая дата позже начала диапазона (неделя прошла), обновляем начальный день
        if (isBefore(rangeStart, new Date())) {
          rangeStart = currentDate; // Стартуем с текущей даты
          rangeEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
        }

        // Форматируем даты в 'yyyy-MM-dd'
        curWeekRanges.push({
          rangeStart: format(rangeStart, 'yyyy-MM-dd'),
          rangeEnd: format(rangeEnd, 'yyyy-MM-dd'),
        });

        // Переходим к следующей неделе
        currentDate = addWeeks(currentDate, 1);
      }

      setWeekRanges((prevWeekRanges) => [...prevWeekRanges, ...curWeekRanges]);
    },
    [weekRanges],
  );

  return (
    <div>
      <EmblaCarousel
        slides={weekRanges}
        options={options}
        generateWeekRanges={generateWeekRanges}
        fetchAvailabilitySlots={fetchAvailabilitySlots}
      />

      <AvailabilityDates
        availDates={availDates}
        setTabIndex={setTabIndex}
        setSchedule={setSchedule}
        schedule={schedule}
        setRepeat={setRepeat}
      />
    </div>
  );
};
