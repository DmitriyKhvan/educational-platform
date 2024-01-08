import React, { useEffect, useState } from 'react';

import { useMutation, useQuery } from '@apollo/client';
import { GET_MENTOR } from 'src/modules/auth/graphql';
import { UPSERT_EXCEPTION_DATES } from 'src/modules/graphql/mutations/upsertExceptionDates';
import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';

import { AvailabilityException } from './AvailabilityException';
import Button from 'src/components/Form/Button';
import notify from 'src/utils/notify';
import Loader from 'src/components/Loader/Loader';

export const AvailabilityExceptions = () => {
  const [t] = useTranslation('common');

  const [availabilityExceptions, setAvailabilityExceptions] = useState([]);
  const [disableSave, setDisableSave] = useState(true);
  const [disabledDates, setDisabledDates] = useState([]);

  const { user } = useAuth();
  const { data: { mentor } = {}, refetch: refetchMentor } = useQuery(
    GET_MENTOR,
    {
      fetchPolicy: 'no-cache',
      variables: { id: user?.mentor?.id },
    },
  );

  const [upsertExceptionDates, { loading: loadingExceptionDates }] =
    useMutation(UPSERT_EXCEPTION_DATES);

  const onSubmit = () => {
    if (availabilityExceptions) {
      const exceptionDates = availabilityExceptions.map((aval) => {
        return {
          date: aval.date,
          slots: aval.slots.map((item) => {
            return {
              from: item.from,
              to: item.to,
            };
          }),
        };
      });

      upsertExceptionDates({
        variables: {
          data: {
            mentorId: user?.mentor?.id,
            exceptionDates,
          },
        },
        onCompleted: () => {
          refetchMentor();
        },
        onError: (error) => {
          notify(error.message, 'error');
        },
      });

      setDisableSave(true);
    }
  };

  useEffect(() => {
    if (mentor) {
      const dates = [];
      const disabledDates = [];

      mentor.exceptionDates.forEach((slot) => {
        const existingSlot = dates.find((item) => item.date === slot.date);

        if (existingSlot) {
          existingSlot.slots.push({
            id: uuid(),
            from: slot.from,
            to: slot.to,
          });
        } else {
          dates.push({
            id: uuid(),
            date: slot.date,
            slots: [{ id: uuid(), from: slot.from, to: slot.to }],
          });

          disabledDates.push(new Date(slot.date));
        }
      });

      dates.sort((a, b) => new Date(a.date) - new Date(b.date));

      setAvailabilityExceptions(dates);
      setDisabledDates(disabledDates);
    }
  }, [mentor]);

  const addAvailabilityException = () => {
    const availabilityException = {
      id: uuid(),
      date: format(new Date(), 'yyyy-MM-dd'),
      slots: [{ id: uuid(), from: '09:00', to: '23:30' }],
    };

    setAvailabilityExceptions([
      ...availabilityExceptions,
      availabilityException,
    ]);

    setDisableSave(false);
  };

  const removeAvailabilityException = (exception) => {
    const idx = availabilityExceptions.findIndex(
      (aval) => aval.id === exception.id,
    );
    setAvailabilityExceptions([
      ...availabilityExceptions.slice(0, idx),
      ...availabilityExceptions.slice(idx + 1),
    ]);

    setDisableSave(false);
  };

  // set date and time
  const availabilityExceptionSlots = (exception) => {
    const idx = availabilityExceptions.findIndex(
      (aval) => aval.id === exception.id,
    );
    setAvailabilityExceptions([
      ...availabilityExceptions.slice(0, idx),
      exception,
      ...availabilityExceptions.slice(idx + 1),
    ]);

    setDisableSave(false);
  };

  return (
    <>
      {loadingExceptionDates && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <div className="container pl-8 pr-6 pb-11 pt-3">
        <h2 className="date_override_title mb-3">Add date overrides</h2>

        <div className="space-y-4">
          {availabilityExceptions.map((exception) => {
            return (
              <AvailabilityException
                key={exception.id}
                exception={exception}
                disabledDates={disabledDates}
                availabilityExceptionSlots={availabilityExceptionSlots}
                removeAvailabilityException={removeAvailabilityException}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-4">
          <Button onClick={addAvailabilityException} theme="outline">
            Add a date override
          </Button>

          <Button onClick={onSubmit} disabled={disableSave} className="w-[15%]">
            {t('save', { ns: 'common' })}
          </Button>
        </div>
      </div>
    </>
  );
};
