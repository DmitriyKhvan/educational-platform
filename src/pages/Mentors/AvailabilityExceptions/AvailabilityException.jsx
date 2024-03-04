import { DatePicker } from '@tremor/react';

import { AvailabilityExceptionSlot } from './AvailabilityExceptionSlot';
import { addMinutes, format, parse } from 'date-fns';

import { PiTrashFill } from 'react-icons/pi';
import Alert from 'src/components/Popup/Alert';
import { useTranslation } from 'react-i18next';
import Button from 'src/components/Form/Button';
import { v4 as uuid } from 'uuid';

export const AvailabilityException = ({
  availabilityExceptionSlots,
  exception,
  removeAvailabilityException,
  disabledDates,
}) => {
  const { t } = useTranslation('modals');

  const onChangeDate = (date) => {
    if (date) {
      const newException = { ...exception, date: format(date, 'yyyy-MM-dd') };
      availabilityExceptionSlots(newException);
    }
  };

  const removeAvailabilityExceptionConfirm = () => {
    Alert(
      t('swal_fire_title'),
      '',
      'warning',
      () => removeAvailabilityException(exception),
      true,
      t('swal_confirm_Button_Text'),
      t('swal_cancel_Button_Text'),
      t('swal_fire_title_conform_msg'),
      t('swal_fire_title_conform_msg1'),
      t('swal_fire_title_conform_msg2'),
    );
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

    availabilityExceptionSlots(newException);
  };

  return (
    <>
      <div>
        <div className="flex items-center mb-4">
          <DatePicker
            onValueChange={onChangeDate}
            value={new Date(exception.date)}
            disabledDates={disabledDates}
            displayFormat="dd MMM yyyy"
            className="max-w-sm rounded border"
          />

          <div className="col-auto align-self-center ">
            <button
              type="button"
              className="btn ms-3"
              onClick={removeAvailabilityExceptionConfirm}
            >
              <PiTrashFill className="text-2xl text-color-border-grey" />
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {exception.slots.map((slot, index) => {
            return (
              <AvailabilityExceptionSlot
                key={slot.id}
                slot={slot}
                index={index}
                exception={exception}
                availabilityExceptionSlots={availabilityExceptionSlots}
              />
            );
          })}

          <div>
            <Button
              disabled={
                exception.slots[exception.slots.length - 1]?.to >= '23:00'
              }
              onClick={addAvailabilityExceptionSlot}
            >
              Add time slot
            </Button>
          </div>
        </div>
      </div>
      <div className="divider "></div>
    </>
  );
};
