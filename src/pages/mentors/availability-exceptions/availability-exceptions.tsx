import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '@/app/providers/auth-provider';
import { UPSERT_EXCEPTION_DATES } from '@/shared/apollo/mutations/upsert-exception-dates';
import { useMutation } from '@apollo/client';
import { parse } from 'date-fns';
import { nanoid } from 'nanoid';

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
import type { ExceptionDateSlot, Maybe, Mentor } from '@/types/types.generated';
import { format, toZonedTime } from 'date-fns-tz';
import { IoIosWarning } from 'react-icons/io';
// import Swal from 'sweetalert2';
import { LuPlus } from 'react-icons/lu';
import { changeSlots } from '../availability/lib/change-slots';

export const AvailabilityExceptions = ({
  mentor,
  refetchMentor,
}: {
  mentor: Mentor;
  refetchMentor: () => void;
}) => {
  const [errorExceptionalDates, setErrorExceptionalDates] = useState();

  const [availabilityExceptions, setAvailabilityExceptions] = useState([]);

  console.log('availabilityExceptions', availabilityExceptions);

  const [startAvailabilityExceptions, setStartAvailabilityExceptions] = useState<
    Maybe<ExceptionDateSlot>[]
  >([]);

  const [disableSave, setDisableSave] = useState(true);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const { user } = useAuth();
  const userTimezone = user?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const [upsertExceptionDates, { loading: loadingExceptionDates }] =
    useMutation(UPSERT_EXCEPTION_DATES);

  const onSubmit = (availabilityExceptions) => {
    if (availabilityExceptions) {
      const exceptionDates = [];
      console.log('availabilityExceptions', availabilityExceptions);
      for (const avail of availabilityExceptions) {
        for (const slot of avail.slots) {
          exceptionDates.push({
            id: !Number.isNaN(Number(slot.id)) ? slot.id : null,
            date: avail.date,
            from: slot.from,
            to: slot.to,
          });
        }
      }

      const changeAvailabilityExceptions = changeSlots(startAvailabilityExceptions, exceptionDates);

      console.log('startAvailabilityExceptions', startAvailabilityExceptions);
      console.log('exceptionDates', exceptionDates);
      console.log('changeAvailabilityExceptions', changeAvailabilityExceptions);

      // return;

      upsertExceptionDates({
        variables: {
          mentorId: user?.mentor?.id,
          exceptionDates: changeAvailabilityExceptions,
        },
        onCompleted: () => {
          refetchMentor();
          notify('Date override is saved');
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
      const startExceptionDates = [];

      for (const slot of mentor.exceptionDates) {
        // To combine slots for the same dates
        const utcDate = format(new Date(Number(slot?.date)), 'yyyy-MM-dd');
        console.log('utcDate', utcDate);

        const utcDateFrom = `${utcDate}T${slot?.from}:00Z`;
        const utcDateTo = `${utcDate}T${slot?.to}:00Z`;

        const date = format(toZonedTime(new Date(utcDate), userTimezone), 'yyyy-MM-dd', {
          timeZone: userTimezone,
        });

        const from = format(toZonedTime(new Date(utcDateFrom), userTimezone), 'HH:mm', {
          timeZone: userTimezone,
        });

        const to = format(toZonedTime(new Date(utcDateTo), userTimezone), 'HH:mm', {
          timeZone: userTimezone,
        });

        startExceptionDates.push({
          id: slot?.id,
          date,
          from,
          to,
        });

        const existingSlot = dates.find((item) => item.date === date);
        if (existingSlot) {
          existingSlot.slots.push({
            id: slot?.id,
            from,
            to,
          });
        } else {
          dates.push({
            id: nanoid(),
            date,
            slots: [{ id: slot?.id, from, to }],
          });

          disabledDates.push(parse(date, 'yyyy-MM-dd', new Date()));
        }
      }

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
        .sort((a, b) => a.date.localeCompare(b.date));

      setAvailabilityExceptions(filterDates);
      setDisabledDates(disabledDates);
      setStartAvailabilityExceptions(startExceptionDates);
    }
  }, [mentor]);

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
