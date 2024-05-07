import React, { useState } from 'react';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { parse } from 'date-fns';
import { AvailabilityException } from './AvailabilityException';
import { format } from 'date-fns-tz';
import Alert from 'src/components/Popup/Alert';
import { useTranslation } from 'react-i18next';
import { FaXmark } from 'react-icons/fa6';

export const AvailabilityExceptionModal = ({
  exception,
  disabledDates,
  onSubmit,
  availabilityExceptions,
}) => {
  const { t } = useTranslation('modals');

  const [open, setOpen] = useState(false);

  const removeAvailabilityExceptionSlot = (exception, slot) => {
    const newSlots = exception.slots.filter((sl) => sl.id !== slot.id);

    const newException = { ...exception, slots: newSlots };

    const idx = availabilityExceptions.findIndex(
      (aval) => aval.id === newException.id,
    );

    if (idx !== -1) {
      const newAvailabilityExceptions = [
        ...availabilityExceptions.slice(0, idx),
        newException,
        ...availabilityExceptions.slice(idx + 1),
      ];

      debugger;

      onSubmit(newAvailabilityExceptions);
    }
  };

  const removeAvailabilityException = (exception) => {
    const newAvailabilityExceptions = availabilityExceptions.filter(
      (aval) => aval.id !== exception.id,
    );

    onSubmit(newAvailabilityExceptions);

    // setDisableSave(false);
  };

  const removeAvailabilityExceptionSlotConfirm = (exception, slot) => {
    Alert(
      t('swal_fire_title'),
      '',
      'warning',
      () => removeAvailabilityExceptionSlot(exception, slot),
      true,
      t('swal_confirm_Button_Text'),
      t('swal_cancel_Button_Text'),
      t('swal_fire_title_conform_msg'),
      t('swal_fire_title_conform_msg1'),
      t('swal_fire_title_conform_msg2'),
    );
  };

  const removeAvailabilityExceptionConfirm2 = (exception) => {
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

  return (
    <li key={exception.id} className="text-sm">
      <div className="flex items-center justify-between p-2">
        <AdaptiveDialog
          open={open}
          setOpen={setOpen}
          button={
            <button>
              {format(
                parse(exception.date, 'yyyy-MM-dd', new Date()),
                'dd MMM yyyy',
              )}
            </button>
          }
        >
          <AvailabilityException
            oldException={exception}
            onSubmit={onSubmit}
            setOpen={setOpen}
            disabledDates={disabledDates.filter((date) => {
              return (
                date.toString() !==
                parse(exception.date, 'yyyy-MM-dd', new Date()).toString()
              );
            })}
            availabilityExceptions={availabilityExceptions}
            // availabilityExceptionSlots={availabilityExceptionSlots}
            removeAvailabilityException={removeAvailabilityException}
          />
        </AdaptiveDialog>

        <button
          type="button"
          onClick={() => removeAvailabilityExceptionConfirm2(exception)}
        >
          <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
        </button>
      </div>

      <ul>
        {exception.slots.map((slot) => {
          return (
            <li
              key={slot.id}
              className="flex items-center justify-between gap-6 p-2"
            >
              <span className="basis-[45%]">
                {format(
                  parse(exception.date, 'yyyy-MM-dd', new Date()),
                  'dd MMM yyyy',
                )}
              </span>

              <div className="basis-[45%]">
                <span>{slot.from}</span> - <span>{slot.to}</span>
              </div>
              <button
                className=""
                type="button"
                onClick={() =>
                  removeAvailabilityExceptionSlotConfirm(exception, slot)
                }
              >
                <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
              </button>
            </li>
          );
        })}
      </ul>
    </li>
  );
};
