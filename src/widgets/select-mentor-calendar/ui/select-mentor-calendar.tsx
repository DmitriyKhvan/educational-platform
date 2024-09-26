import { format, lastDayOfMonth, startOfMonth, subDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

import './select-mentor-calendar.scss';
import { Calendar } from '@/components/calendar';
import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import SelectLessonDatePopover from '@/entities/select-lesson-date-popover/ui/select-lesson-date-popover';
import { AVAILABILITY_SLOTS } from '@/shared/apollo/queries/lessons/availability-slots';
import { CalendarView, type LanguageType, localeDic } from '@/shared/constants/global';
import {} from '@/shared/ui/popover';
import { cn } from '@/shared/utils/functions';
import { useCalendarControls } from '@/shared/utils/use-calendar-controls';
import { useQuery } from '@apollo/client';
import type FullCalendar from '@fullcalendar/react';
import { BsExclamationLg } from 'react-icons/bs';

interface AvailabilitySlotType {
  date: string;
  from: string;
  to: string;
}

function SelectMentorCalendar() {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 1), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(
    format(subDays(lastDayOfMonth(new Date()), 1), 'yyyy-MM-dd'),
  );

  const [chosenDates, setChosenDates] = useState<AvailabilitySlotType[]>([]);

  const [open, setOpen] = useState(false);
  const [t, i18n] = useTranslation(['lessons', 'common']);
  const calendarRef = useRef<FullCalendar>(null);

  const { goNext, goPrev, goToday, setMonthView, setWeekView, date, view, viewDictionary } =
    useCalendarControls({
      calendarRef,
      initialView: CalendarView.MONTH_VIEW,
    });

  const { data, loading } = useQuery(AVAILABILITY_SLOTS, {
    variables: {
      mentorId: '1',
      timezone: 'Asia/Seoul',
      rangeStart: startDate,
      rangeEnd: endDate,
      duration: 30,
    },
  });

  useEffect(() => {
    if (date) {
      if (startOfMonth(date) < new Date()) {
        setStartDate(format(new Date(), 'yyyy-MM-dd'));
      } else {
        setStartDate(format(subDays(startOfMonth(date), 1), 'yyyy-MM-dd'));
      }
      setEndDate(format(subDays(lastDayOfMonth(date), 1), 'yyyy-MM-dd'));
    }
  }, [date]);

  const [absDates, setAbsDates] = useState<AvailabilitySlotType[]>([]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (data?.availabilitySlots && !loading) {
      const abscent = [];

      for (const chosenDate of chosenDates) {
        if (
          !data?.availabilitySlots
            ?.find((avs: any) => avs.date === chosenDate.date)
            ?.timeSlots?.find((avs: any) => avs.from === chosenDate.from) &&
          chosenDate.date >= data?.availabilitySlots[0]?.date &&
          chosenDate.date <= data?.availabilitySlots[data?.availabilitySlots?.length - 1]?.date
        ) {
          abscent.push(chosenDate);
        }
      }
      setAbsDates(abscent);
    }
  }, [chosenDates, data]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const [schedule, setSchedule] = useState<AvailabilitySlotType | undefined>();
  // console.log('🚀 ~ SelectMentorCalendar ~ schedule:', schedule);
  const [repeat, setRepeat] = useState<number | null>(0);

  if (!calendarRef) return null;

  const events = [
    ...(data?.availabilitySlots
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .reduce((acc: any, curr: any) => {
        // console.log(curr)
        acc.push(...curr.timeSlots);
        return acc;
      }, [])
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      ?.map((s: any) => ({
        id: `${s.date}${s.from}`,
        title: `${s.from}-${s.to}`,
        slot: s,
        start: new Date(`${s.date}T${s.from}:00`),
        type: 'default',
        end: new Date(`${s.date}T${s.to}:00`),
        duration: 25,
      })) ?? []),
    ...absDates.map((s: any) => ({
      id: `${s.date}${s.from}`,
      title: `${s.from}-${s.to}`,
      slot: s,
      start: new Date(`${s.date}T${s.from}:00`),
      type: 'abscent',
      end: new Date(`${s.date}T${s.to}:00`),
      duration: 25,
    })),
  ];
  console.log('🚀 ~ useEffect ~ events:', events);

  const renderEventContent = (eventInfo: any) => {
    if (eventInfo.event.extendedProps.type === 'abscent') {
      return (
        <div className="relative w-full focus:bg-opacity-100 focus:text-white bg-color-red rounded bg-opacity-10 text-color-red py-2">
          <BsExclamationLg className="text-white bg-color-red rounded-full absolute -right-1 -top-1 w-5 h-5 border-2 border-white" />
          <p className=" text-center font-medium w-full">{eventInfo?.event?.title}</p>
        </div>
      );
    }

    return (
      <SelectLessonDatePopover
        setPopoverOpen={setPopoverOpen}
        popoverOpen={popoverOpen}
        slot={eventInfo.event.extendedProps.slot}
        setRepeat={setRepeat}
        setSchedule={setSchedule}
        setChosenDates={setChosenDates}
        btn={
          <button
            type="button"
            className={cn(
              'w-full font-medium focus:bg-opacity-100 focus:text-white bg-color-banner-green rounded bg-opacity-10 text-color-banner-green py-2',
              chosenDates.find(
                (cd) =>
                  eventInfo?.event?.extendedProps?.slot?.date === cd.date &&
                  eventInfo?.event?.extendedProps?.slot?.from === cd.from,
              ) && 'bg-opacity-100 text-white',
            )}
          >
            {eventInfo?.event?.title}
          </button>
        }
      />
    );
  };

  return (
    <div className="bg-white border rounded-xl">
      <header className=" p-6">
        <div className="flex justify-between w-full">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex space-x-2">
              <Button theme="outline" type="button" onClick={goPrev} className="w-10 h-10 shadow">
                <FaChevronLeft />
              </Button>
              <Button theme="outline" type="button" onClick={goNext} className="w-10 h-10 shadow">
                <FaChevronRight />
              </Button>
            </div>
            <h2 className="font-semibold text-2xl whitespace-nowrap mr-4">
              {format(date, 'LLLL yyyy', {
                locale: localeDic[i18n.language as LanguageType],
              })}
            </h2>
          </div>
          <div className="flex space-x-3">
            <MyDropdownMenu
              open={open}
              setOpen={setOpen}
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
                  onChange={() => setWeekView()}
                  type="radio"
                  name="calendarView"
                  label={viewDictionary[CalendarView.WEEK_VIEW]}
                  className="flex-row-reverse justify-between h-[56px] border-b  pl-1 pr-4"
                  onClick={() => setOpen(false)}
                />

                <CheckboxField
                  checked={view === CalendarView.MONTH_VIEW}
                  onChange={() => setMonthView()}
                  type="radio"
                  name="calendarView"
                  label={viewDictionary[CalendarView.MONTH_VIEW]}
                  className="flex-row-reverse justify-between h-[56px] border-b  pl-1 pr-4"
                  onClick={() => setOpen(false)}
                />
              </div>
            </MyDropdownMenu>

            <Button theme="outline" onClick={goToday} className="h-10 shadow">
              {t('calendar_today')}
            </Button>
          </div>
        </div>
      </header>

      <Calendar
        ref={calendarRef}
        events={events}
        eventContent={renderEventContent}
        contentHeight={1400}
      />
    </div>
  );
}

export default SelectMentorCalendar;
