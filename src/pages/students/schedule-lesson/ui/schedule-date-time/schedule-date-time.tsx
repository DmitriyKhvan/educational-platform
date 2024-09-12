import { addWeeks, endOfWeek, isBefore, startOfWeek } from 'date-fns';
import { format } from 'date-fns-tz';
import { useCallback, useEffect, useState } from 'react';

interface WeekRanges {
  rangeStart: string;
  rangeEnd: string;
}

export const ScheduleDateTime = () => {
  const [weekRanges, setWeekRanges] = useState<WeekRanges[]>([]);

  console.log('weekRanges', weekRanges);

  useEffect(() => {
    generateWeekRanges(4);
  }, []);

  const generateWeekRanges = useCallback((weeksCount: number) => {
    const weekRanges: WeekRanges[] = [];

    // Начальная дата — текущая
    let currentDate = new Date();

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
      weekRanges.push({
        rangeStart: format(rangeStart, 'yyyy-MM-dd'),
        rangeEnd: format(rangeEnd, 'yyyy-MM-dd'),
      });

      // Переходим к следующей неделе
      currentDate = addWeeks(currentDate, 1);
    }

    setWeekRanges(weekRanges);
  }, []);

  return <div>ScheduleDateTime</div>;
};
