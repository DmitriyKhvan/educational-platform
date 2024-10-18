import {
  addDays,
  addMonths,
  // format,
  isAfter,
  lastDayOfMonth,
  set,
  startOfMonth,
} from 'date-fns';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

import { Calendar } from '@/components/calendar';
import Button from '@/components/form/button';
import { CalendarView, type LanguageType, localeDic } from '@/shared/constants/global';

import { useCalendarControls } from '@/shared/utils/use-calendar-controls';
import type { AvailabilitySlot, Mentor } from '@/types/types.generated';
import type FullCalendar from '@fullcalendar/react';

import './select-mentor-calendar.scss';
import { useAuth } from '@/app/providers/auth-provider';
import { useAvailabilitySlotsQuery } from '@/shared/apollo/queries/timesheets/availability-slots.generated';
import { cn } from '@/shared/utils/functions';
import type { EventClickArg } from '@fullcalendar/core';
import { format, toZonedTime } from 'date-fns-tz';
import { BsExclamationLg } from 'react-icons/bs';
import SelectSlotPopover from './select-slot-popover';
interface ScheduleCalendarProps {
  mentor: Mentor;
  repeat: number | boolean | null;
  setSchedule: React.Dispatch<React.SetStateAction<AvailabilitySlot | undefined>>;
  setRepeat: React.Dispatch<React.SetStateAction<number | boolean | null>>;
  schedule: AvailabilitySlot | undefined;
  setTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

interface AvailabilitySlotType {
  date: string;
  from: string;
  to: string;
}

function SelectMentorCalendar({
  mentor,
  repeat,
  setSchedule,
  setRepeat,
  schedule,
  setTabIndex,
}: ScheduleCalendarProps) {
  const { user } = useAuth();

  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const today = toZonedTime(new Date(), userTimezone);
  const initialDate = useMemo(
    () =>
      process.env.REACT_APP_PRODUCTION === 'false'
        ? format(today, 'yyyy-MM-dd HH:mm:ss')
        : format(addDays(today, 2), 'yyyy-MM-dd HH:mm:ss'),
    [],
  );

  const [startDate, setStartDate] = useState(initialDate);
  const [endDate, setEndDate] = useState(
    format(
      set(lastDayOfMonth(today), {
        hours: 23,
        minutes: 59,
        seconds: 59,
      }),
      'yyyy-MM-dd HH:mm:ss',
    ),
  );

  const [slot, setSlot] = useState<AvailabilitySlotType | undefined>(schedule);

  const [chosenDates, setChosenDates] = useState<AvailabilitySlot[]>(schedule ? [schedule] : []);

  const [t, i18n] = useTranslation(['lessons', 'common']);
  const calendarRef = useRef<FullCalendar>(null);

  const { goNext, goPrev, goToday, date } = useCalendarControls({
    calendarRef,
    initialView: CalendarView.MONTH_VIEW,
  });

  const { data, loading } = useAvailabilitySlotsQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    variables: {
      mentorId: mentor.id,
      timezone: userTimezone,
      rangeStart: startDate,
      rangeEnd: endDate,
      duration: 25,
    },
  });

  useEffect(() => {
    if (date) {
      if (startOfMonth(date) < today) {
        setStartDate(initialDate);
      } else {
        setStartDate(format(startOfMonth(date), 'yyyy-MM-dd HH:mm:ss'));
      }
      setEndDate(
        format(
          set(lastDayOfMonth(date), { hours: 23, minutes: 59, seconds: 59 }),
          'yyyy-MM-dd HH:mm:ss',
        ),
      );
    }
  }, [date]);

  const [absDates, setAbsDates] = useState<AvailabilitySlot[]>([]);

  useEffect(() => {
    if (data?.availabilitySlots && !loading) {
      const abscent = [];

      for (const chosenDate of chosenDates) {
        if (
          !data?.availabilitySlots
            ?.find((avs) => avs?.date === chosenDate.date)
            ?.timeSlots?.find((avs: AvailabilitySlot) => avs.from === chosenDate.from) &&
          chosenDate.date >= (data?.availabilitySlots[0]?.date ?? new Date()) &&
          chosenDate.date <=
            (data?.availabilitySlots[data?.availabilitySlots?.length - 1]?.date ?? new Date())
        ) {
          abscent.push(chosenDate);
        }
      }
      setAbsDates(abscent);
    }
  }, [chosenDates, data]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const eventMapFunc = (type: 'default' | 'abscent') => (s: AvailabilitySlot) => ({
    id: `${s.date}${s.from}`,
    title: `${s.from}-${s.to}`,
    slot: s,
    start: new Date(`${s.date}T${s.from}:00`),
    type,
    end: new Date(`${s.date}T${s.from}:00`),
    userTimezone,
    duration: 25,
  });

  const events = loading
    ? []
    : [
        ...(data?.availabilitySlots
          .reduce((acc, curr) => {
            if (curr?.timeSlots) acc.push(...(curr?.timeSlots ?? []));
            return acc;
          }, [] as AvailabilitySlot[])
          ?.map(eventMapFunc('default')) ?? []),
        ...absDates.map(eventMapFunc('abscent')),
      ];

  const nowPlus30Days = addMonths(today, 1);
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

  useEffect(() => {
    if (repeat) {
      setChosenDates((v) => {
        let dateToIncrement =
          v?.[0] && toZonedTime(new Date(`${v[0].date}T${v[0].from}:00Z`), userTimezone);
        const res = v?.[0]
          ? [
              v[0],
              ...Array.from(Array(typeof repeat === 'boolean' ? 1 : repeat * 4 - 1)).map(() => {
                dateToIncrement = addDays(dateToIncrement, 7);

                const res = {
                  date: format(dateToIncrement, 'yyyy-MM-dd'),
                  from: slot?.from ?? format(dateToIncrement, 'HH:mm'),
                  to: slot?.to ?? format(dateToIncrement, 'HH:mm'),
                };

                return res;
              }),
            ]
          : [];
        return res;
      });
    } else if (!repeat) {
      setChosenDates((v) => (v?.[0] ? [v[0]] : []));
    }
    // setChosenDates(slot ? [slot] : []);
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.extendedProps.type === 'abscent' || popoverOpen) return;

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

  if (!calendarRef) return null;

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
        setTabIndex={setTabIndex}
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
