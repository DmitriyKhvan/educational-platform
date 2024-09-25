import { addDays, format, lastDayOfMonth, startOfMonth, subDays } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaAngleDown, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
// import { Calendar } from "src/components/Calendar";
// import MyDropdownMenu from "src/components/DropdownMenu";
// import Button from "src/components/Form/Button";
// import CheckboxField from "src/components/Form/CheckboxField";
// import { MyDialog } from "src/components/MyDialog";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "src/components/Popover";
// import { AVAILABILITY_SLOTS } from "src/shared/apollo/queries/mentors/availabilitySlots";
// import { CalendarView, localeDic } from "src/shared/constants/global";
// import { AdaptiveDialog } from "src/shared/ui/AdaptiveDialog";
// import { useCalendarControls } from "src/shared/utils/useCalendarControls";
import CloseConfirmationModal from './close-confirmation-modal';

import './select-mentor-calendar.scss';
import { Calendar } from '@/components/calendar';
import MyDropdownMenu from '@/components/dropdown-menu';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import { AVAILABILITY_SLOTS } from '@/shared/apollo/queries/lessons/availability-slots';
import { CalendarView, type LanguageType, localeDic } from '@/shared/constants/global';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { cn } from '@/shared/utils/functions';
import { useCalendarControls } from '@/shared/utils/use-calendar-controls';
import { useQuery } from '@apollo/client';
import type FullCalendar from '@fullcalendar/react';
// import { cn } from 'src/shared/utils/functions';

function SelectMentorCalendar() {
  // const [selectedDates, setSelectedDates] = useState([])

  const [startDate, setStartDate] = useState(format(subDays(new Date(), 1), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(
    format(subDays(lastDayOfMonth(new Date()), 1), 'yyyy-MM-dd'),
  );

  console.log('🚀 ~ SelectMentorCalendar ~ endDate:', endDate);
  console.log('🚀 ~ SelectMentorCalendar ~ startDate:', startDate);
  // console.log("🚀 ~ SelectMentorCalendar ~ data:", data);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [chosenDates, setChosenDates] = useState<any[]>([]);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [absentDates, setAbsentDates] = useState<any[]>([]);
  console.log('🚀 ~ SelectMentorCalendar ~ absentDates:', absentDates);
  console.log('🚀 ~ SelectMentorCalendar ~ chosenDates:', chosenDates);
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

  const {
    data,
    // loading,
    // refetch: refetchUser,
  } = useQuery(AVAILABILITY_SLOTS, {
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
      console.log('🚀 ~ useEffect ~ date:', date);
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
  useEffect(() => {
    if (repeatPeriod && repeatWeekly) {
      setChosenDates((v) => {
        let dateToIncrement = v?.[0];
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const absDates = [] as any[];
        const res = v?.[0]
          ? [
              v[0],
              ...Array.from(Array(repeatPeriod * 4 - 1)).map(() => {
                dateToIncrement = addDays(new Date(dateToIncrement), 7);
                if (
                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  !data?.availabilitySlots?.some((s: any) => {
                    return (
                      s?.date &&
                      s?.from &&
                      new Date(`${s.date}T${s.from}:00`)?.toISOString() ===
                        dateToIncrement.toISOString()
                    );
                  })
                ) {
                  console.log(
                    '🚀 ~ ...Array.from ~ dateToIncrement:',
                    dateToIncrement.toISOString(),
                  );
                  absDates.push(dateToIncrement.toISOString());
                }
                return dateToIncrement.toISOString();
              }),
            ]
          : [];
        setAbsentDates(absDates);
        // console.log("🚀 ~ useEffect ~ dateToIncrement:", dateToIncrement);
        return res;
      });
    } else if (!repeatWeekly) {
      setAbsentDates([]);
      setChosenDates((v) => (v?.[0] ? [v[0]] : []));
    }
  }, [repeatPeriod, repeatWeekly]);

  // useEffect(() => {
  //   updateEvents(view);
  // }, [view]);

  // const [isOpen, setIsOpen] = useState(false)

  const [popoverOpen, setPopoverOpen] = useState(undefined);
  const [confirmCloseModal, setConfirmCloseModal] = useState(false);

  if (!calendarRef) return null;

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const renderEventContent = (eventInfo: any) => {
    // console.log("🚀 ~ renderEventContent ~ eventInfo:", eventInfo);
    // const data = eventInfo.event.extendedProps.resource;
    // console.log(eventInfo.event._instance.range.start, "START");

    // let content = <></>;
    // const [s]
    // const testValues = [
    // 	{ label: "Test1", value: "Test1" },
    // 	{ label: "Test2", value: "Test2" },
    // 	{ label: "Test3", value: "Test3" },
    // ];

    return (
      <Popover
      // onOpenChange={() => {
      //   if (open) {
      //     setChosenDates([eventInfo?.event?._instance?.range?.start?.toISOString()]);
      //   }
      //   setChosenDates([eventInfo?.event?._instance?.range?.start?.toISOString()]);
      // }}
      // open={popoverOpen === eventInfo?.event?.title}
      // onOpenChange={(open) => {
      //   // console.log("TEST");
      //   // if (!open) {
      //   // 	setPopoverOpen(undefined);
      //   // }
      //   if (open && !popoverOpen) {
      //     setPopoverOpen(eventInfo?.event?.title);
      //   } else {
      //     setConfirmCloseModal(true);
      //   }
      // }}

      // className="z-0"
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={() => {
              setChosenDates([eventInfo?.event?._instance?.range?.start?.toISOString()]);
              setRepeatWeekly(false);
              setRepeatPeriod(1);
            }}
            className={cn(
              'w-full focus:bg-opacity-100 focus:text-white bg-color-banner-green rounded bg-opacity-10 text-color-banner-green py-2',
              chosenDates.includes(eventInfo?.event?._instance?.range?.start?.toISOString()) &&
                'bg-opacity-100 text-white',
            )}
          >
            {eventInfo?.event?.title ?? '10:00-10:30'}
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[300px] bg-white"
          side="left"
          sideOffset={10}
          avoidCollisions={true}
        >
          <div className="grid gap-4">
            <div className="space-y-3 mb-1">
              <h4 className="font-semibold leading-none">Friday, June 8th</h4>
              <p className="text-sm text-muted-foreground">10:00 – 10:25</p>
            </div>
            <div className="grid gap-2 mb-4">
              <label className="flex items-center gap-3 mb-4">
                <CheckboxField
                  square
                  checked={repeatWeekly}
                  onChange={(e) => setRepeatWeekly(e.target.checked)}
                />
                {/* <input
									type="checkbox"
									checked={repeatWeekly}
									onChange={(e) => setRepeatWeekly(e.target.checked)}
								/> */}
                Repeat weekly
              </label>

              {repeatWeekly && (
                // <SelectField
                // 	// value={value}
                // 	options={testValues}
                // 	// onChange={onChange}
                // />
                <MyDropdownMenu
                  // open={open}
                  // setOpen={setOpen}
                  contentClassName="z-50 w-full"
                  button={
                    <Button
                      theme="clear"
                      className={
                        'flex justify-between items-center gap-3 w-full border border-gray-200'
                      }
                    >
                      {/* <VscGlobe className="text-2xl" /> */}
                      <span className="grow text-left">For 1 month</span>
                      <FaAngleDown />
                    </Button>
                  }
                >
                  {/* <ul className="w-[calc(100vw-2*24px)] sm:w-[514px]"> */}
                  <ul className={'w-[252px] z-50'}>
                    <li
                      key={'1month'}
                      className={'border-b border-color-border-grey last:border-b-0'}
                    >
                      <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                        <span className={'text-sm font-medium text-color-dark-purple'}>
                          {/* {t(lang.label)} */}
                          For 1 month
                        </span>
                        <CheckboxField
                          onChange={() => setRepeatPeriod(1)}
                          type="radio"
                          name="period"
                          checked={repeatPeriod === 1}
                        />
                      </label>
                    </li>
                    <li
                      key={'3month'}
                      className={'border-b border-color-border-grey last:border-b-0'}
                    >
                      <label className="flex items-center justify-between gap-3 p-4 cursor-pointer ">
                        <span className={'text-sm font-medium text-color-dark-purple'}>
                          {/* {t(lang.label)} */}
                          For 3 months
                        </span>
                        <CheckboxField
                          onChange={() => setRepeatPeriod(3)}
                          type="radio"
                          name="period"
                          checked={repeatPeriod === 3}
                        />
                      </label>
                    </li>
                  </ul>
                </MyDropdownMenu>
              )}
              {/* <Button theme="gray">
								<BiTrash />
								Delete time-slot
							</Button> */}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      // <Popover>
      // </Popover>
    );
  };

  return (
    <div className="bg-white border rounded-xl">
      <CloseConfirmationModal
        open={confirmCloseModal}
        setOpen={setConfirmCloseModal}
        onCloseClick={() => {
          // setPopoverOpen(undefined);
          setConfirmCloseModal(false);
        }}
      />
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
