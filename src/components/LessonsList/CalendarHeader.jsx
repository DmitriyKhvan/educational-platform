import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import MyDropdownMenu from 'src/components/DropdownMenu';
import Button from 'src/components/Form/Button';
import CheckboxField from 'src/components/Form/CheckboxField';
import {
  COURSE_COLORS,
  CalendarView,
  courseColorsDict,
  localeDic,
} from 'src/constants/global';
import { cn } from 'src/utils/functions';
import { getTranslatedTitle } from 'src/utils/getTranslatedTitle';
import { useCourseColors } from 'src/utils/useCourseColors';

const CalendarHeader = ({ calendarRef }) => {
  const { getColorByCourseId, coursesList, colorsReady } = useCourseColors();
  const [t, i18n] = useTranslation(['lessons', 'common']);
  const [view, setView] = useState(CalendarView.WEEK_VIEW);
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

  if (!calendarRef || !colorsReady) return null;

  return (
    <div>
      <div className="flex justify-between w-full">
        <div className="flex items-center mb-6">
          <h2 className="font-semibold text-2xl whitespace-nowrap mr-4">
            {format(date, 'LLLL yyyy', {
              locale: localeDic[i18n.language],
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
        {coursesList?.map((c) => (
          <div
            key={c.id}
            className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg"
          >
            <span
              className={cn(
                'w-[10px] h-[10px] block rounded-[3px]',
                getColorByCourseId(c.id)?.indicator,
              )}
            ></span>
            <p>{getTranslatedTitle(c, i18n.language)}</p>
          </div>
        ))}
        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span
            className={cn(
              'w-[10px] h-[10px] block rounded-[3px]',
              courseColorsDict[COURSE_COLORS.GREEN]?.indicator,
            )}
          ></span>
          <p>{t('trial', { ns: 'common' })}</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
