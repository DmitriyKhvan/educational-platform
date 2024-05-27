import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CalendarView } from 'src/shared/constants/global';

export function useCalendarControls({ calendarRef, initialView }) {
  const [t, i18n] = useTranslation(['lessons', 'common']);
  const [view, setView] = useState(initialView || CalendarView.MONTH_VIEW);
  const [date, setDate] = useState(new Date());

  const viewDictionary = useMemo(
    () => ({
      [CalendarView.DAY_VIEW]: t('calendar_day'),
      [CalendarView.WEEK_VIEW]: t('calendar_week'),
      [CalendarView.MONTH_VIEW]: t('calendar_month'),
    }),
    [i18n, i18n.language, t],
  );

  useEffect(() => {
    queueMicrotask(() => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      calendarApi.today();
      setDate(calendarApi.getDate());
    });
  }, [view]);

  const goNext = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setDate(calendarApi.getDate());
  }, [calendarRef]);

  const goPrev = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setDate(calendarApi.getDate());
  }, [calendarRef]);

  const goToday = useCallback(() => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setDate(calendarApi.getDate());
  }, [calendarRef]);

  const setMonthView = useCallback(() => {
    setView(CalendarView.MONTH_VIEW);
  }, [calendarRef]);

  const setWeekView = useCallback(() => {
    setView(CalendarView.WEEK_VIEW);
  }, [calendarRef]);

  const setDayView = useCallback(() => {
    setView(CalendarView.DAY_VIEW);
  }, [calendarRef]);

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
