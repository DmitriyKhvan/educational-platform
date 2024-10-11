import { addMonths, format, isAfter, lastDayOfMonth, startOfMonth, subDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

import { Calendar } from '@/components/calendar';
import Button from '@/components/form/button';
import { AVAILABILITY_SLOTS } from '@/shared/apollo/queries/lessons/availability-slots';
import { CalendarView, type LanguageType, localeDic } from '@/shared/constants/global';

import { useCalendarControls } from '@/shared/utils/use-calendar-controls';
import type { AvailabilitySlot, GroupedAvailabilitySlots, Mentor } from '@/types/types.generated';
import { useQuery } from '@apollo/client';
import type FullCalendar from '@fullcalendar/react';

import './select-mentor-calendar.scss';
import { useAuth } from '@/app/providers/auth-provider';
import { cn } from '@/shared/utils/functions';
import type { EventClickArg } from '@fullcalendar/core';
import { BsExclamationLg } from 'react-icons/bs';
import SelectSlotPopover from './select-slot-popover';
interface ScheduleCalendarProps {
  mentor: Mentor;
  repeat: number | boolean | null;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  setRepeat: React.Dispatch<React.SetStateAction<number | boolean | null>>;
}

interface AvailabilitySlotType {
  date: string;
  from: string;
  to: string;
}

function SelectMentorCalendar({ mentor, repeat, setSchedule, setRepeat }: ScheduleCalendarProps) {
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 1), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(lastDayOfMonth(new Date()), 'yyyy-MM-dd'));

  const [slot, setSlot] = useState<AvailabilitySlotType | undefined>();

  const [chosenDates, setChosenDates] = useState<AvailabilitySlot[]>([]);

  const [t, i18n] = useTranslation(['lessons', 'common']);
  const calendarRef = useRef<FullCalendar>(null);

  const { goNext, goPrev, goToday, date } = useCalendarControls({
    calendarRef,
    initialView: CalendarView.MONTH_VIEW,
  });

  const { user } = useAuth();

  const { data, loading } = useQuery(AVAILABILITY_SLOTS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      mentorId: mentor.id,
      timezone: user?.timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
      rangeStart: startDate,
      rangeEnd: endDate,
      duration: 25,
    },
  });

  useEffect(() => {
    if (date) {
      if (startOfMonth(date) < new Date()) {
        setStartDate(format(new Date(), 'yyyy-MM-dd'));
      } else {
        setStartDate(format(subDays(startOfMonth(date), 1), 'yyyy-MM-dd'));
      }
      setEndDate(format(lastDayOfMonth(date), 'yyyy-MM-dd'));
    }
  }, [date]);

  const [absDates, setAbsDates] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    if (data?.availabilitySlots && !loading) {
      const abscent = [];

      for (const chosenDate of chosenDates) {
        if (
          !data?.availabilitySlots
            ?.find((avs: GroupedAvailabilitySlots) => avs.date === chosenDate.date)
            ?.timeSlots?.find((avs: AvailabilitySlot) => avs.from === chosenDate.from) &&
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

  if (!calendarRef) return null;

  const eventMapFunc = (type: 'default' | 'abscent') => (s: AvailabilitySlot) => ({
    id: `${s.date}${s.from}`,
    title: `${s.from}-${s.to}`,
    slot: s,
    start: new Date(`${s.date}T${s.from}:00`),
    type,
    end: new Date(`${s.date}T${s.to}:00`),
    duration: 25,
  });

  const events = loading
    ? []
    : [
        ...(data?.availabilitySlots
          .reduce((acc: AvailabilitySlot[], curr: GroupedAvailabilitySlots) => {
            acc.push(...curr.timeSlots);
            return acc;
          }, [])
          ?.map(eventMapFunc('default')) ?? []),
        ...absDates.map(eventMapFunc('abscent')),
      ];

  const nowPlus30Days = addMonths(new Date(), 1);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
      <div
        className={cn(
          'w-full font-medium text-center focus:bg-opacity-100 focus:text-white bg-color-banner-green rounded bg-opacity-10 text-color-banner-green py-2',
          isAfter(eventInfo.event._instance.range.start, nowPlus30Days) &&
            'bg-opacity-5 text-opacity-30',
          chosenDates.find(
            (cd) =>
              eventInfo?.event?.extendedProps?.slot?.date === cd.date &&
              eventInfo?.event?.extendedProps?.slot?.from === cd.from,
          ) && 'bg-opacity-100 text-white text-opacity-100',
        )}
      >
        {eventInfo?.event?.title}
      </div>
    );
  };

  const [popoverPosition, setPopoverPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const eventRectRef = useRef<{ top: number; left: number; height: number } | null>(null);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.type === 'abscent') return;

    const eventElement = clickInfo.el.getBoundingClientRect();

    if (isAfter(clickInfo?.event?._instance?.range.start ?? new Date(), nowPlus30Days)) return;
    setSlot(clickInfo.event.extendedProps.slot);

    setChosenDates(clickInfo.event.extendedProps.slot ? [clickInfo.event.extendedProps.slot] : []);

    setSchedule(undefined);

    const isLeftSide = window.innerWidth / 2 > eventElement.x;

    const isBottom = eventElement.y > window.innerHeight - 223;

    eventRectRef.current = {
      top: eventElement.top,
      height: eventElement.height,
      left:
        eventElement.left +
        window.scrollX +
        (isLeftSide ? eventElement.width + 5 : -(eventElement.width * 1.45)),
    };

    setPopoverPosition({
      top: eventElement.top + (isBottom ? -150 : 0),
      left:
        eventElement.left +
        window.scrollX +
        (isLeftSide ? eventElement.width + 5 : -(eventElement.width * 1.45)),
    });

    setPopoverOpen(true);

    clickInfo.jsEvent.stopPropagation();
  };

  // Фукнции для динамического изменения позиции поповера
  // const updatePopoverPosition = () => {
  //   console.log('🚀 ~ updatePopoverPosition ~ popoverPosition:', popoverPosition);
  //   const scrollableParent = document.querySelector('.scrollable-parent');

  //   if (eventRectRef.current) {
  //     const { top, left } = eventRectRef.current;
  //     // console.log('🚀 ~ updatePopoverPosition ~ top, left, height:', top, left, height);
  //     // Update popover position relative to the scrolled position
  //     setPopoverPosition({
  //       top: top - (scrollableParent?.scrollTop ?? 0), // Account for scrolling
  //       left: left,
  //     });
  //   }
  // };

  // useEffect(() => {
  //   const scrollableParent = document.querySelector('.scrollable-parent');

  //   scrollableParent?.addEventListener('scroll', updatePopoverPosition);

  //   return () => {
  //     scrollableParent?.removeEventListener('scroll', updatePopoverPosition);
  //   };
  // }, []);

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
            <Button theme="outline" onClick={goToday} className="h-10 shadow">
              {t('calendar_today')}
            </Button>
          </div>
        </div>
      </header>

      <SelectSlotPopover
        slot={slot}
        popoverOpen={popoverOpen}
        setPopoverOpen={setPopoverOpen}
        setSchedule={setSchedule}
        setRepeat={setRepeat}
        repeat={repeat}
        setChosenDates={setChosenDates}
        popoverPosition={popoverPosition}
      />

      <Calendar
        ref={calendarRef}
        events={events}
        isLoading={loading}
        eventContent={loading ? undefined : renderEventContent}
        eventClick={handleEventClick}
        contentHeight={1400}
      />
    </div>
  );
}

export default SelectMentorCalendar;
