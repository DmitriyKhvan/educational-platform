import { DatePicker } from '@tremor/react';

import { AvailabilityExceptionSlot } from './AvailabilityExceptionSlot';
import { format } from 'date-fns';

import { PiTrashFill } from 'react-icons/pi';
import Alert from 'src/components/Popup/Alert';
import { useTranslation } from 'react-i18next';

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
        </div>
      </div>
      <div className="divider "></div>
    </>
  );
};
