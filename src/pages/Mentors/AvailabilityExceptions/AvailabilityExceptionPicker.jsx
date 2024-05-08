import { DayPicker } from 'react-day-picker';
import { AvailabilityExceptionSlot } from './AvailabilityExceptionSlot';
import { addMinutes, format, parse } from 'date-fns';

import Button from 'src/components/Form/Button';
import { v4 as uuid } from 'uuid';
import { useMemo, useState } from 'react';
import { LuPlus } from 'react-icons/lu';

import 'react-day-picker/dist/style.css';
import './lib/dayPicker.css';
import * as Dialog from '@radix-ui/react-dialog';

export const AvailabilityExceptionPicker = ({
  oldException,
  onSubmit,
  availabilityExceptions,
  disabledDates,
  disableSave,
}) => {
  const [exception, setException] = useState(oldException);

  const disabledAddAvail = useMemo(() => {
    return (
      !exception || exception?.slots[exception.slots.length - 1]?.to >= '23:00'
    );
  }, [exception]);

  const onChangeDate = (date) => {
    if (date) {
      const exception = {
        id: uuid(),

        // slots: [{ id: uuid(), from: '00:00', to: '23:30' }],
        slots: [],
        ...oldException,
        date: format(date, 'yyyy-MM-dd'),
      };

      setException(exception);
    }
  };

  const addAvailabilityExceptionSlot = () => {
    let newTime = { id: uuid(), from: '00:00', to: '23:30' };

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
      date: format(
        parse(exception.date, 'yyyy-MM-dd', new Date()),
        'yyyy-MM-dd',
      ),
    };

    let newAvailabilityExceptions = [];

    const idx = availabilityExceptions.findIndex(
      (aval) => aval.id === newException.id,
    );
    if (idx !== -1) {
      newAvailabilityExceptions = [
        ...availabilityExceptions.slice(0, idx),
        newException,
        ...availabilityExceptions.slice(idx + 1),
      ];
    } else {
      newAvailabilityExceptions = [...availabilityExceptions, newException];
    }

    onSubmit(newAvailabilityExceptions);
    setException(null);
  };

  return (
    <div className="m-auto w-[384px]">
      <h2 className="text-xl font-bold leading-7">
        Select the date(s) you want to assign date overrides
      </h2>
      <div className="flex items-center mb-4 gap-2">
        <DayPicker
          // captionLayout="dropdown-buttons"
          // fromYear={2024}
          // toYear={2034}
          fromDate={new Date()}
          mode="single"
          disabled={disabledDates}
          selected={new Date(exception?.date)}
          onSelect={onChangeDate}
          formatters={{
            formatWeekdayName: (date) => format(date, 'EEE'),
          }}
        />
      </div>

      <div className="space-y-4 py-6 border-y border-gray-200">
        {exception?.slots.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">
              What hours are you unavailable?
            </h4>
            {exception?.slots?.map((slot, index) => {
              return (
                <AvailabilityExceptionSlot
                  key={slot.id}
                  slot={slot}
                  index={index}
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
