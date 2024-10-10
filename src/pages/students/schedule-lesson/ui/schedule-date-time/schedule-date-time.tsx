import { useAuth } from '@/app/providers/auth-provider';
import { useAvailabilitySlotsLazyQuery } from '@/shared/apollo/queries/timesheets/availability-slots.generated';
import notify from '@/shared/utils/notify';
import type {
  AvailabilitySlot,
  GroupedAvailabilitySlots,
  Mentor,
  PackageSubscription,
} from '@/types/types.generated';
import { addMonths, addWeeks, endOfWeek, isBefore, startOfWeek } from 'date-fns';
import { format } from 'date-fns-tz';
import type { EmblaOptionsType } from 'embla-carousel';
import { useCallback, useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { AvailabilityDates } from './availability-dates';
import { EmblaCarousel } from './embla-carousel';

export interface WeekRanges {
  rangeStart: string;
  rangeEnd: string;
}

interface ScheduleDateTimeProps {
  mentor: Mentor;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  setRepeat: React.Dispatch<React.SetStateAction<number | boolean | null>>;
  repeat: number | boolean | null;
  schedule: AvailabilitySlot | undefined;
  plan: PackageSubscription | undefined;
  lessonId?: string | null;
}

export const ScheduleDateTime: React.FC<ScheduleDateTimeProps> = ({
  mentor,
  setTabIndex,
  setSchedule,
  schedule,
  setRepeat,
  repeat,
  plan,
  lessonId,
}) => {
  //remove jin
  console.log('ScheduleDateTime', repeat);
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

      const limitRangeEnd = addMonths(new Date(), 1);

      for (let i = 0; i < weeksCount; i++) {
        // Определяем понедельник и воскресенье для текущей недели
        let rangeStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Понедельник
        let rangeEnd = endOfWeek(currentDate, { weekStartsOn: 1 }); // Воскресенье

        // Если текущая дата позже начала диапазона (неделя прошла), обновляем начальный день
        if (isBefore(rangeStart, new Date())) {
          rangeStart = currentDate; // Стартуем с текущей даты
        }

        if (isBefore(limitRangeEnd, rangeEnd)) {
          rangeEnd = limitRangeEnd; // Ограничиваем дату окончания диапазона на 1 месяц вперед
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
      <div className="flex items-center gap-2 mb-[27px]">
        {!lessonId && (
          <button type="button" onClick={() => setTabIndex(1)}>
            <IoArrowBack className="text-base sm:text-2xl" />
          </button>
        )}

        <h1 className="text-base sm:text-4xl text-color-dark-purple font-bold leading-normal tracking-tight">
          Select date and time
        </h1>
      </div>

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
        repeat={repeat}
      />
    </div>
  );
};
