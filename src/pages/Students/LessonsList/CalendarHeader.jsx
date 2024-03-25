import { format } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import { CalendarView } from 'src/constants/global';

const CalendarHeader = ({ calendarRef }) => {
  const [t, i18n] = useTranslation(['lessons']);
  const [view, setView] = useState(CalendarView.MONTH_VIEW);
  const [date, setDate] = useState(new Date());

  const viewDictionary = useMemo(
    () => ({
      [CalendarView.DAY_VIEW]: t('calendar_day'),
      [CalendarView.WEEK_VIEW]: t('calendar_week'),
      [CalendarView.MONTH_VIEW]: t('calendar_month'),
    }),
    [i18n, i18n.language, t],
  );

  const goNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
    setDate(calendarApi.getDate());
    console.log(calendarApi.getDate());
  };

  const goPrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setDate(calendarApi.getDate());
    console.log(calendarApi.getDate());
  };

  const goToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
    setDate(calendarApi.getDate());
  };

  useEffect(() => {
    // dayGridMonth,timeGridWeek,timeGridDay
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(view);
    calendarApi.today();
    setDate(calendarApi.getDate());
  }, [view]);

  if (!calendarRef) return null;

  return (
    <div className="flex justify-between w-full">
      <div className="flex items-center mb-6">
        <h2 className="font-semibold text-2xl whitespace-nowrap mr-4">
          {format(date, 'LLLL yyyy', {
            locale: i18n.language === 'en' ? enUS : ko,
          })}
        </h2>
        <div className="flex space-x-2">
          <Button
            theme="outline"
            type="button"
            onClick={goPrev}
            className="w-10 h-10 shadow"
          >
            <FaChevronLeft />
          </Button>
          <Button
            theme="outline"
            type="button"
            onClick={goNext}
            className="w-10 h-10 shadow"
          >
            <FaChevronRight />
          </Button>
        </div>
      </div>
      <div className="flex space-x-3">
        <MyDropdownMenu
          button={
            <Button theme="outline" className="gap-6 shadow">
              {viewDictionary[view]} <FaChevronDown />
            </Button>
          }
          contentClassName=" rounded-xl overflow-hidden border"
        >
          <div className="flex flex-col">
            {Object.values(CalendarView).map((v) => (
              <CheckboxField
                key={v}
                checked={view === v}
                onClick={() => setView(v)}
                type="radio"
                name="calendarView"
                label={viewDictionary[v]}
                className="flex-row-reverse justify-between h-[56px] border-b  pl-1 pr-4"
              />
            ))}
          </div>
        </MyDropdownMenu>

        <Button theme="outline" onClick={goToday} className=" shadow">
          {t('calendar_today')}
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;
