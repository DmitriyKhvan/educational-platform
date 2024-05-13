import React, { useEffect, useState } from 'react';

import { useMutation } from '@apollo/client';
import { UPSERT_EXCEPTION_DATES } from 'src/modules/graphql/mutations/upsertExceptionDates';
import { format, parse } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'src/modules/auth';

import { AvailabilityException } from './AvailabilityException';
import Button from 'src/components/Form/Button';
import notify from 'src/utils/notify';
import Loader from 'src/components/Loader/Loader';
import Swal from 'sweetalert2';

export const AvailabilityExceptions = ({ mentor, refetchMentor }) => {
  const [t] = useTranslation('common');

  const [availabilityExceptions, setAvailabilityExceptions] = useState([]);
  const [disableSave, setDisableSave] = useState(true);
  const [disabledDates, setDisabledDates] = useState([]);
  const [updateExceptionDate, setUpdateExceptionDate] = useState(null);

  const { user } = useAuth();

  console.log(availabilityExceptions, "availablityExceptions")
  console.log(disabledDates, "disabledDates")
  const [upsertExceptionDates, { loading: loadingExceptionDates }] =
    useMutation(UPSERT_EXCEPTION_DATES);

  const parseErrorMessage = (error) => {
    try {
      const errorData = JSON.parse(error.message);
      if (typeof errorData !== 'object') {
        throw new Error();
      }
      if (errorData?.errorExceptionalDates) {
        removeAvailabilityExceptionConfirm(errorData?.errorExceptionalDates);
      }
    } catch (e) {
      notify(error.message, 'error');
    }
  };

  const removeAvailabilityExceptionConfirm = (errorExceptionalDates) => {
    const message = errorExceptionalDates.reduce((acc, cur) => {
      return `${acc}<li>${cur.date}: <b>${cur.from}</b> - <b>${cur.to}</b></li>`;
    }, '');
    Swal.fire({
      title: 'Exceptional dates is not saved',
      html: `<p>The following exceptional time interval contain scheduled lessons:</p></br><ul>${message}</ul></br><p>Please, reschedule these lessons.</p>`,
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#6133af',
      confirmButtonText: 'ok',
    });
  };

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

          notify('Exceptional dates is saved');

          setUpdateExceptionDate(Date.now());
        },
        onError: (error) => {
          parseErrorMessage(error);
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
        // To combine slots for the same dates
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

          disabledDates.push(parse(slot.date, 'yyyy-MM-dd', new Date()));
        }
      });

      const filterDates = dates
        .map((date) => {
          if (
            date.slots.some((slot) => slot.from === null && slot.to === null)
          ) {
            return {
              ...date,
              slots: [],
            };
          }
          return date;
        })
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setAvailabilityExceptions(filterDates);
      setDisabledDates(disabledDates);
    }
  }, [mentor, updateExceptionDate]);

  const addAvailabilityException = () => {
    const availabilityException = {
      id: uuid(),
      date: format(new Date(), 'yyyy-MM-dd'),
      // slots: [{ id: uuid(), from: '00:00', to: '23:30' }],
      slots: [],
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

      <div className="min-w-[410px] w-fit p-6 border border-gray-100 rounded-lg shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
        <div className="space-y-2 mb-6">
          <h1 className="text-xl text-color-dark-purple font-bold">
            Date overrides
          </h1>
          <h3 className="max-w-[425px] text-sm text-gray-400">
            Override your availability for specific dates when your hours differ
            from your regular weekly hours.
          </h3>
        </div>

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

          <Button onClick={onSubmit} disabled={disableSave} className="">
            {t('save', { ns: 'common' })}
          </Button>
        </div>
      </div>
    </>
  );
};
