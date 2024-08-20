import { AvailabilityExceptionSlot } from '@/pages/mentors/availability-exceptions/availability-exception-slot';
import { addMinutes, format, parse } from 'date-fns';
import { useMemo, useState } from 'react';

import { DayPickerCustom } from '@/components/day-picker-custom';
import Button from '@/components/form/button';
import * as Dialog from '@radix-ui/react-dialog';
import { LuPlus } from 'react-icons/lu';
import { nanoid } from 'nanoid';

export const AvailabilityExceptionPicker = ({
  oldException,
  onSubmit,
  availabilityExceptions,
  disabledDates,
  disableSave,
}) => {
  const [exception, setException] = useState(oldException);
  console.log('oldException', oldException);

  const disabledAddAvail = useMemo(() => {
    return !exception || exception?.slots[exception.slots.length - 1]?.to >= '23:00';
  }, [exception]);

  const onChangeDate = (date: Date) => {
    if (date) {
      const exception = {
        id: nanoid(),

        // slots: [{ id: nanoid(), from: '00:00', to: '23:30' }],
        slots: [],
        ...oldException,
        date: format(date, 'yyyy-MM-dd'),
      };

      setException(exception);
    }
  };

  const addAvailabilityExceptionSlot = () => {
    let newTime = { id: nanoid(), from: '00:00', to: '23:30' };

    if (exception.slots.length) {
      const from = exception.slots[exception.slots.length - 1].to;
      let to = '';

      if (from >= '23:00') {
        to = format(addMinutes(parse(from, 'HH:mm', new Date()), 30), 'HH:mm');
      } else {
        to = format(addMinutes(parse(from, 'HH:mm', new Date()), 60), 'HH:mm');
      }

      newTime = { ...newTime, from, to };
    }

    const newSlots = [...exception.slots, newTime];

    const newException = { ...exception, slots: newSlots };

    setException(newException);

    // availabilityExceptionSlots(newException);
  };

  const submitHandler = () => {
    // So that there is no error in the date
    const newException = {
      ...exception,
      date: format(parse(exception.date, 'yyyy-MM-dd', new Date()), 'yyyy-MM-dd'),
    };

    let newAvailabilityExceptions = [];

    const idx = availabilityExceptions.findIndex((aval) => aval.id === newException.id);
    if (idx !== -1) {
      newAvailabilityExceptions = [
        ...availabilityExceptions.slice(0, idx),
        newException,
        ...availabilityExceptions.slice(idx + 1),
      ];
    } else {
      newAvailabilityExceptions = [...availabilityExceptions, newException];
    }

    // onSubmit(newAvailabilityExceptions);
    onSubmit([newException]);
    setException(null);
  };

  return (
    <div className="m-auto w-[384px]">
      <h2 className="text-xl font-bold leading-7">
        Select the date(s) you want to assign date overrides
      </h2>
      <div className="flex items-center mb-4 gap-2">
        <DayPickerCustom
          // captionLayout="dropdown-buttons"
          // fromYear={2024}
          // toYear={2034}
          fromDate={new Date()}
          mode="single"
          disabled={disabledDates}
          selected={exception?.date && parse(exception.date, 'yyyy-MM-dd', new Date())}
          onSelect={onChangeDate}
          formatters={{
            formatWeekdayName: (date) => format(date, 'EEE'),
          }}
        />
      </div>

      <div className="space-y-4 py-6 border-y border-gray-200">
        {exception?.slots.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">What hours are you unavailable?</h4>
            {exception?.slots?.map((slot) => {
              return (
                <AvailabilityExceptionSlot
                  key={slot.id}
                  slot={slot}
                  exception={exception}
                  setException={setException}
                />
              );
            })}
          </div>
        )}

        <Button
          theme="clear"
          className="h-auto p-0 gap-1 text-color-purple disabled:bg-transparent disabled:text-gray-300"
          disabled={disabledAddAvail}
          onClick={disabledAddAvail ? undefined : addAvailabilityExceptionSlot}
        >
          <LuPlus className="text-base" />
          <span>Add time slot</span>
        </Button>
      </div>

      <div className="flex gap-4 mt-8">
        <Dialog.Close asChild>
          <Button theme="outline" className="basis-1/2">
            Cancel
          </Button>
        </Dialog.Close>

        <Button
          disabled={!exception && disableSave}
          className="basis-1/2"
          onClick={!exception ? undefined : submitHandler}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
