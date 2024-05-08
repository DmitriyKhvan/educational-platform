import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useMutation } from '@apollo/client';
import { UPSERT_EXCEPTION_DATES } from 'src/modules/graphql/mutations/upsertExceptionDates';
import { parse } from 'date-fns';
import { v4 as uuid } from 'uuid';
import { useAuth } from 'src/modules/auth';

import { AvailabilityExceptionPicker } from './AvailabilityExceptionPicker';
import Button from 'src/components/Form/Button';
import notify from 'src/utils/notify';
import Loader from 'src/components/Loader/Loader';
// import Swal from 'sweetalert2';
import { LuPlus } from 'react-icons/lu';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { AvailabilityException } from './AvailabilityException';
import { AvailabilityModalConfirm } from './AvailabilityModalConfirm';
import { IoIosWarning } from 'react-icons/io';
import { format } from 'date-fns-tz';
import { formatTimeToSeconds } from '../Availiability/lib/formatTimeToSeconds';
import { formatTime } from '../Availiability/lib/formatTime';

export const AvailabilityExceptions = ({ mentor, refetchMentor }) => {
  const [errorExceptionalDates, setErrorExceptionalDates] = useState();

  const [availabilityExceptions, setAvailabilityExceptions] = useState([]);
  console.log('availabilityExceptions', availabilityExceptions);
  const [disableSave, setDisableSave] = useState(true);
  const [disabledDates, setDisabledDates] = useState([]);

  const [updateExceptionDate, setUpdateExceptionDate] = useState(null);

  const { user } = useAuth();

  const [upsertExceptionDates, { loading: loadingExceptionDates }] =
    useMutation(UPSERT_EXCEPTION_DATES);

  const parseErrorMessage = (error) => {
    try {
      const errorData = JSON.parse(error.message);
      if (typeof errorData !== 'object') {
        throw new Error();
      }
      if (errorData?.errorExceptionalDates) {
        setErrorExceptionalDates(errorData?.errorExceptionalDates);
      }
    } catch (e) {
      notify(error.message, 'error');
    }
  };

  // const removeAvailabilityExceptionConfirm = (errorExceptionalDates) => {
  //   const message = errorExceptionalDates.reduce((acc, cur) => {
  //     return `${acc}<li>${cur.date}: <b>${cur.from}</b> - <b>${cur.to}</b></li>`;
  //   }, '');
  //   Swal.fire({
  //     title: 'Exceptional dates is not saved',
  //     html: `<p>The following exceptional time interval contain scheduled lessons:</p></br><ul>${message}</ul></br><p>Please, reschedule these lessons.</p>`,
  //     icon: 'warning',
  //     showCancelButton: false,
  //     confirmButtonColor: '#6133af',
  //     confirmButtonText: 'ok',
  //   });
  // };

  const onSubmit = (availabilityExceptions) => {
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

  return (
    <>
      {loadingExceptionDates && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <div className="space-y-6 min-w-[410px] w-fit p-6 border border-gray-100 rounded-lg shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
        <div className="space-y-2 mb-6">
          <h1 className="text-xl text-color-dark-purple font-bold">
            Date overrides
          </h1>
          <h3 className="max-w-[425px] text-sm text-gray-400">
            Override your availability for specific dates.
          </h3>
        </div>

        <AdaptiveDialog
          button={
            <Button
              theme="outline"
              className="gap-2 shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)] focus:shadow-[0_0_0_0.25rem_rgba(13,110,253,0.25)] text-color-purple hover:text-white"
            >
              <LuPlus />
              <span>Add a date override</span>
            </Button>
          }
        >
          <AvailabilityExceptionPicker
            onSubmit={onSubmit}
            disabledDates={disabledDates}
            availabilityExceptions={availabilityExceptions}
            disableSave={disableSave}
          />
        </AdaptiveDialog>

        <ul>
          {availabilityExceptions.map((exception) => {
            return (
              <AvailabilityException
                key={exception.id}
                exception={exception}
                disabledDates={disabledDates}
                onSubmit={onSubmit}
                availabilityExceptions={availabilityExceptions}
              />
            );
          })}
        </ul>
      </div>

      {errorExceptionalDates && (
        <AdaptiveDialog
          open={!!errorExceptionalDates}
          setOpen={setErrorExceptionalDates}
        >
          <AvailabilityModalConfirm
            icon={
              <div className="w-full flex justify-center mb-6">
                <div className="p-3 rounded-lg bg-[rgba(234,_33,_33,_0.10)]">
                  <IoIosWarning className="text-2xl text-[#EA2121]" />
                </div>
              </div>
            }
            title="Overlapping lesson(s)"
            text={
              <>
                You have {errorExceptionalDates.length}{' '}
                <b>lesson(s) scheduled</b>:
                <ul>
                  {errorExceptionalDates.map((date, index) => {
                    return (
                      <li key={index}>
                        {format(
                          parse(date.date, 'yyyy-MM-dd', new Date()),
                          'dd MMM yyyy',
                        )}{' '}
                        <b>
                          {formatTime(
                            formatTimeToSeconds(date.from),
                            'hh:mm a',
                          )}
                        </b>{' '}
                        -{' '}
                        <b>
                          {formatTime(formatTimeToSeconds(date.to), 'hh:mm a')}
                        </b>
                      </li>
                    );
                  })}
                </ul>
              </>
            }
            btns={
              <div className="flex gap-3">
                <Link className="basis-1/2" to="/mentor/lesson-calendar">
                  <Button
                    className="w-full"
                    onClick={() => setErrorExceptionalDates(false)}
                  >
                    Go to Lessons
                  </Button>
                </Link>

                <Button
                  onClick={() => setErrorExceptionalDates(false)}
                  theme="gray"
                  className="basis-1/2"
                >
                  Back
                </Button>
              </div>
            }
          />
        </AdaptiveDialog>
      )}
    </>
  );
};
