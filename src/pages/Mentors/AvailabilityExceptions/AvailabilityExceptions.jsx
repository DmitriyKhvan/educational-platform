import React, { useState } from 'react';

import Button from 'src/components/Form/Button';
import { v4 as uuid } from 'uuid';
import { AvailabilityException } from './AvailabilityException';
import { useTranslation } from 'react-i18next';

export const AvailabilityExceptions = () => {
  // {
  //   day: '2023/12/29';
  //   slots: [
  //     { from: '09:00', to: '12:00' },
  //     { from: '17:00', to: '23:30' },
  //   ];
  // }

  const [t] = useTranslation('common');

  const [availabilityExceptions, setAvailabilityExceptions] = useState([]);

  const addAvailabilityException = () => {
    const availabilityException = {
      id: uuid(),
      day: '',
      slots: [{ id: uuid(), from: '09:00', to: '23:30' }],
    };

    setAvailabilityExceptions([
      ...availabilityExceptions,
      availabilityException,
    ]);
  };

  // установить дату и время
  const availabilityExceptionSlots = ({ id, idSlot, timeType, time }) => {
    console.log(id);
    console.log(idSlot);
    console.log(timeType);
    console.log(time);

    // const avail = {id, day, slots:[...slots]}
  };

  console.log('availabilityExceptions', availabilityExceptions);

  return (
    <div className="p-4 pb-11">
      <h2 className="date_override_title mb-3">Add date overrides</h2>

      <div className="space-y-4">
        {availabilityExceptions.map((exception) => {
          return (
            <AvailabilityException
              key={exception.id}
              exception={exception}
              availabilityExceptionSlots={availabilityExceptionSlots}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <Button
          onClick={addAvailabilityException}
          className="mt-4"
          theme="outline"
        >
          Add a date override
        </Button>

        <Button>{t('save', { ns: 'common' })}</Button>
      </div>
    </div>
  );
};
