import { format } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import { CalendarView } from 'src/constants/global';
import { useCourseTranslation } from 'src/utils/useCourseTranslation';

const CalendarHeader = ({ calendarRef }) => {
  const { getTitleByCourseId } = useCourseTranslation();
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
  };

  const goPrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
    setDate(calendarApi.getDate());
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
    <div>
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
                  onChange={() => setView(v)}
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

      <div className="flex mb-6 text-sm items-center gap-3">
        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span className="w-[10px] h-[10px] bg-color-purple block rounded-[3px]"></span>
          <p>{getTitleByCourseId(1)}</p>
        </div>
        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span className="w-[10px] h-[10px] bg-[#FF9335] block rounded-[3px]"></span>
          <p>{getTitleByCourseId(3)}</p>
        </div>
        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span className="w-[10px] h-[10px] bg-[#19BBFE] block rounded-[3px]"></span>
          <p>{getTitleByCourseId(2)}</p>
        </div>
        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span className="w-[10px] h-[10px] bg-[#00D986] block rounded-[3px]"></span>
          <p>Trial</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
