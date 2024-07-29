import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/app/providers/auth-provider';
import { UPSERT_EXCEPTION_DATES } from '@/shared/apollo/mutations/upsert-exception-dates';
import { useMutation } from '@apollo/client';
import { parse } from 'date-fns';
import { v4 as uuid } from 'uuid';

import Button from '@/components/form/button';
import Loader from '@/components/loader/loader';
import { ModalConfirm } from '@/entities/modal-confirm';
import { AvailabilityException } from '@/pages/mentors/availability-exceptions/availability-exception';
import { AvailabilityExceptionPicker } from '@/pages/mentors/availability-exceptions/availability-exception-picker';
import { formatTime } from '@/pages/mentors/availability/lib/format-time';
import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { parseErrorMessage } from '@/pages/mentors/availability/lib/parse-error-message';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import notify from '@/shared/utils/notify';
import { format } from 'date-fns-tz';
import { IoIosWarning } from 'react-icons/io';
// import Swal from 'sweetalert2';
import { LuPlus } from 'react-icons/lu';

export const AvailabilityExceptions = ({ mentor, refetchMentor }) => {
  const [errorExceptionalDates, setErrorExceptionalDates] = useState();

  const [availabilityExceptions, setAvailabilityExceptions] = useState([]);
  const [disableSave, setDisableSave] = useState(true);
  const [disabledDates, setDisabledDates] = useState([]);

  const [updateExceptionDate, setUpdateExceptionDate] = useState(null);

  const { user } = useAuth();

  const [upsertExceptionDates, { loading: loadingExceptionDates }] =
    useMutation(UPSERT_EXCEPTION_DATES);

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

          notify('Date override is saved');

          setUpdateExceptionDate(Date.now());
        },
        onError: (error) => {
          const parseError = parseErrorMessage(error);
          if (parseError) {
            setErrorExceptionalDates(parseError);
          } else {
            notify(error.message, 'error');
          }
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
          if (date.slots.some((slot) => slot.from === null && slot.to === null)) {
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
          <h1 className="text-xl text-color-dark-purple font-bold">Date overrides</h1>
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
        <AdaptiveDialog open={!!errorExceptionalDates} setOpen={setErrorExceptionalDates}>
          <ModalConfirm
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
                You have {errorExceptionalDates.errorExceptionalDates.length}{' '}
                <b>lesson(s) scheduled</b>:
                <ul>
                  {errorExceptionalDates.errorExceptionalDates.map((date, index) => {
                    return (
                      <li key={index}>
                        {format(parse(date.date, 'yyyy-MM-dd', new Date()), 'dd MMM yyyy')}{' '}
                        <b>{formatTime(formatTimeToSeconds(date.from), 'hh:mm a')}</b> -{' '}
                        <b>{formatTime(formatTimeToSeconds(date.to), 'hh:mm a')}</b>
                      </li>
                    );
                  })}
                </ul>
              </>
            }
            btns={
              <div className="flex gap-3">
                <Link className="basis-1/2" to="/mentor/lesson-calendar">
                  <Button className="w-full" onClick={() => setErrorExceptionalDates(false)}>
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
