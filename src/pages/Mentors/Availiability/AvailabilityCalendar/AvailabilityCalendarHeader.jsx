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
// import { getTranslatedTitle } from 'src/utils/getTranslatedTitle';

const AvailabilityCalendarHeader = ({ calendarRef }) => {
  const [t, i18n] = useTranslation(['lessons', 'common']);
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
    queueMicrotask(() => {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      calendarApi.today();
      setDate(calendarApi.getDate());
    });
  }, [view]);

  if (!calendarRef) return null;

  return (
    <div className=" p-6">
      <div className="flex justify-between w-full">
        <div className="mb-6">
          <h2 className="font-semibold text-2xl whitespace-nowrap mr-4">
            {format(date, 'LLLL yyyy', {
              locale: localeDic[i18n.language],
            })}
          </h2>
          <p className="text-sm text-color-light-grey">Set your weekly hours</p>
        </div>
        <div className="flex space-x-3">
          <MyDropdownMenu
            button={
              <Button theme="outline" className="gap-6 shadow h-10">
                {viewDictionary[view]} <FaChevronDown />
              </Button>
            }
            contentClassName=" rounded-xl overflow-hidden border"
          >
            <div className="flex flex-col">
              <CheckboxField
                checked={view === CalendarView.WEEK_VIEW}
                onChange={() => setView(CalendarView.WEEK_VIEW)}
                type="radio"
                name="calendarView"
                label={viewDictionary[CalendarView.WEEK_VIEW]}
                className="flex-row-reverse justify-between h-[56px] border-b  pl-1 pr-4"
              />

              <CheckboxField
                checked={view === CalendarView.MONTH_VIEW}
                onChange={() => setView(CalendarView.MONTH_VIEW)}
                type="radio"
                name="calendarView"
                label={viewDictionary[CalendarView.MONTH_VIEW]}
                className="flex-row-reverse justify-between h-[56px] border-b  pl-1 pr-4"
              />
              {/* {Object.values(CalendarView).map((v) => (
                <CheckboxField
                  key={v}
                  checked={view === v}
                  onChange={() => setView(v)}
                  type="radio"
                  name="calendarView"
                  label={viewDictionary[v]}
                  className="flex-row-reverse justify-between h-[56px] border-b  pl-1 pr-4"
                />
              ))} */}
            </div>
          </MyDropdownMenu>

          <Button theme="outline" onClick={goToday} className="h-10 shadow">
            {t('calendar_today')}
          </Button>

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
      </div>

      <div className="flex mb-6 text-sm items-center gap-3">
        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span
            className={cn(
              'w-[10px] h-[10px] block rounded-[3px]',
              courseColorsDict[COURSE_COLORS.PURPLE]?.indicator,
            )}
          ></span>
          <p>Regular students</p>
        </div>

        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span
            className={cn(
              'w-[10px] h-[10px] block rounded-[3px]',
              courseColorsDict[COURSE_COLORS.ORANGE]?.indicator,
            )}
          ></span>
          <p>Trial students</p>
        </div>

        <div className="bg-color-grey3 h-[33px] py-2 px-3 flex items-center gap-2 rounded-lg">
          <span
            className={cn(
              'w-[10px] h-[10px] block rounded-[3px]',
              courseColorsDict[COURSE_COLORS.GRAY]?.indicator,
            )}
          ></span>
          <p>Date overrides</p>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityCalendarHeader;
