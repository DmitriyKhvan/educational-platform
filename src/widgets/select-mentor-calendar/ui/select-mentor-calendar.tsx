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
// import { cn } from 'src/shared/utils/functions';

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

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [chosenDates, setChosenDates] = useState<AvailabilitySlotType[]>([]);
  console.log('🚀 ~ SelectMentorCalendar ~ chosenDates:', chosenDates);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [absentDates, setAbsentDates] = useState<any[]>([]);
  // const [chosenTime, setChosenTime] = useState(undefined);

  const [repeatWeekly, setRepeatWeekly] = useState(false);
  const [repeatPeriod, setRepeatPeriod] = useState(1);

  const [open, setOpen] = useState(false);
  const [t, i18n] = useTranslation(['lessons', 'common']);
  const calendarRef = useRef<FullCalendar>(null);

  const { goNext, goPrev, goToday, setMonthView, setWeekView, date, view, viewDictionary } =
    useCalendarControls({
      calendarRef,
      initialView: CalendarView.MONTH_VIEW,
    });

  const { data } = useQuery(AVAILABILITY_SLOTS, {
    // fetchPolicy: 'network-only',
    variables: {
      mentorId: '1',
      timezone: 'Asia/Seoul',
      rangeStart: startDate,
      // rangeStart: format(new Date(), 'yyyy-MM-dd'),
      rangeEnd: endDate,
      // rangeEnd: format(addDays(new Date(), 90), 'yyyy-MM-dd'),
      duration: 30,
    },
  });

  useEffect(() => {
    if (date) {
      if (startOfMonth(date) < new Date()) {
        setStartDate(format(new Date(), 'yyyy-MM-dd'));
      } else {
        // setStartDate(format(subDays(startOfMonth(date), 1), "yyyy-MM-01"));
        setStartDate(format(subDays(startOfMonth(date), 1), 'yyyy-MM-dd'));
      }
      setEndDate(format(subDays(lastDayOfMonth(date), 1), 'yyyy-MM-dd'));
    }
  }, [date]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  // useEffect(() => {
  //   if (repeatPeriod && repeatWeekly) {
  //     setChosenDates((v) => {
  //       let dateToIncrement = v?.[0];
  //       // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //       const absDates = [] as any[];
  //       const res = v?.[0]
  //         ? [
  //             v[0],
  //             ...Array.from(Array(repeatPeriod * 4 - 1)).map(() => {
  //               dateToIncrement = addDays(new Date(dateToIncrement), 7);
  //               if (
  //                 // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //                 !data?.availabilitySlots?.some((s: any) => {
  //                   return (
  //                     s?.date &&
  //                     s?.from &&
  //                     new Date(`${s.date}T${s.from}:00`)?.toISOString() ===
  //                       dateToIncrement.toISOString()
  //                   );
  //                 })
  //               ) {
  //                 absDates.push(dateToIncrement.toISOString());
  //               }
  //               return dateToIncrement.toISOString();
  //             }),
  //           ]
  //         : [];
  //       setAbsentDates(absDates);
  //       // console.log("🚀 ~ useEffect ~ dateToIncrement:", dateToIncrement);
  //       return res;
  //     });
  //   } else if (!repeatWeekly) {
  //     setAbsentDates([]);
  //     setChosenDates((v) => (v?.[0] ? [v[0]] : []));
  //   }
  // }, [repeatPeriod, repeatWeekly]);

  const [popoverOpen, setPopoverOpen] = useState(false);
  console.log('🚀 ~ SelectMentorCalendar ~ popoverOpen:', popoverOpen);
  const [confirmCloseModal, setConfirmCloseModal] = useState(false);

  const [testDate, setTestDate] = useState<
    { date: string; from: string; to: string } | undefined
  >();

  const [schedule, setSchedule] = useState<AvailabilitySlotType | undefined>();
  console.log('🚀 ~ SelectMentorCalendar ~ schedule:', schedule);
  const [repeat, setRepeat] = useState<number | null>(0);

  // useEffect(() => {
  //   if (schedule?.date && schedule.from && repeat) {
  //     setChosenDates(() => {
  //       let dateToIncrement = new Date(`${schedule.date}T${schedule.from}:00Z`);

  //       return Array.from(Array(repeat * 4 - 1)).map(() => {
  //         const dateToRet = dateToIncrement.toISOString();
  //         dateToIncrement = addDays(new Date(dateToIncrement), 7);
  //         // const res = {date: format(dateToIncrement, "yyyy-MM-dd"), from: format(dateToIncrement, "HH:mm")}
  //         return dateToRet;
  //       });
  //     });
  //   }
  // }, [schedule, repeat]);

  if (!calendarRef) return null;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const renderEventContent = (eventInfo: any) => {
    return (
      <SelectLessonDatePopover
        // date={eventInfo.event.extendedProps.date as { date: string; from: string; to: string }}
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
              'w-full focus:bg-opacity-100 focus:text-white bg-color-banner-green rounded bg-opacity-10 text-color-banner-green py-2',
              // schedule === eventInfo.event.extendedProps.slot && 'bg-opacity-100 text-white',
              // (schedule === eventInfo.event.extendedProps.slot ||
              //   chosenDates.includes(eventInfo?.event?._instance?.range?.start?.toISOString())) &&
              //   'bg-opacity-100 text-white',
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
      {/* <CloseConfirmationModal
        open={confirmCloseModal}
        setOpen={setConfirmCloseModal}
        onCloseClick={() => {
          setDate(null)
          // setPopoverOpen(undefined);
          setConfirmCloseModal(false);
        }}
      /> */}
      {/* <SelectLessonDatePopover date={date} /> */}

      {/* <MyDialog
				open={confirmCloseModal}
				setOpen={setConfirmCloseModal}
				// button={button}
				// hideCloseBtn={hideCloseBtn}
				overlayClassname="z-50"
				className="z-50"
				avoidCollisions={true}
			>
				Are you sure to close?
				<Button
					onClick={() => {
						setPopoverOpen(undefined);
						setConfirmCloseModal(false);
					}}
				>
					YES
				</Button>
			</MyDialog> */}

      <header className=" p-6">
        {/* <button
          className="bg-red-500 w-20 h-20"
          type="button"
          onClick={() => setTestDate((v) => (v ? null : new Date().toISOString()))}
        >
          test button
        </button> */}

        {/* <SelectLessonDatePopover date={testDate} setSchedule={setSchedule} setRepeat={setRepeat} /> */}

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
        events={data?.availabilitySlots
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

            end: new Date(`${s.date}T${s.to}:00`),
            duration: 25,
          }))}
        // events={[
        // 	{
        // 		id: 3,
        // 		title: "11:30-11:55 1",
        // 		start: new Date(),
        // 	},
        // 	{
        // 		id: 5,
        // 		title: "11:30-11:55 2",
        // 		start: new Date(),
        // 	},
        // 	{
        // 		id: 6,
        // 		title: "11:30-11:55 3",
        // 		start: new Date(),
        // 	},
        // 	{
        // 		id: 7,
        // 		title: "11:30-11:55 4",
        // 		start: new Date(),
        // 	},
        // 	{
        // 		id: 8,
        // 		title: "11:30-11:55 5",
        // 		start: new Date(),
        // 	},
        // 	{
        // 		id: 9,
        // 		title: "12:30-12:55",
        // 		start: addDays(new Date(), 1),
        // 	},
        // ]}
        eventContent={renderEventContent}
        contentHeight={1400}
      />
    </div>
  );
}

export default SelectMentorCalendar;
