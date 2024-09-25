import { CalendarView, type CalendarViewType } from '@/shared/constants/global';
import type FullCalendar from '@fullcalendar/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UseCalendarControlsProps {
  calendarRef: React.MutableRefObject<FullCalendar | null | undefined>;
  initialView?: CalendarViewType;
}

export function useCalendarControls({ calendarRef, initialView }: UseCalendarControlsProps) {
  const { t } = useTranslation(['lessons', 'common']);
  const [view, setView] = useState<CalendarViewType>(initialView || CalendarView.MONTH_VIEW);
  const [date, setDate] = useState<Date>(new Date());

  const viewDictionary = useMemo(
    () => ({
      [CalendarView.DAY_VIEW]: t('calendar_day'),
      [CalendarView.WEEK_VIEW]: t('calendar_week'),
      [CalendarView.MONTH_VIEW]: t('calendar_month'),
    }),
    [t],
  );

  useEffect(() => {
    queueMicrotask(() => {
      const calendarApi = calendarRef.current?.getApi();
      if (calendarApi) {
        calendarApi.changeView(view);
        calendarApi.today();
        setDate(calendarApi.getDate());
      }
    });
  }, [view, calendarRef]);

  const goNext = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  }, [calendarRef]);

  const goPrev = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  }, [calendarRef]);

  const goToday = useCallback(() => {
    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  }, [calendarRef]);

  const setMonthView = useCallback(() => {
    setView(CalendarView.MONTH_VIEW);
  }, []);

  const setWeekView = useCallback(() => {
    setView(CalendarView.WEEK_VIEW);
  }, []);

  const setDayView = useCallback(() => {
    setView(CalendarView.DAY_VIEW);
  }, []);

  return {
    view,
    date,
    goNext,
    goPrev,
    goToday,
    setMonthView,
    setWeekView,
    setDayView,
    setView,
    viewDictionary,
  };
}
