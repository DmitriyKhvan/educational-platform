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
import { format } from 'date-fns-tz';
import { IoIosWarning } from 'react-icons/io';
// import Swal from 'sweetalert2';
import { LuPlus } from 'react-icons/lu';
import { changeSlots } from '../availability/lib/change-slots';
import type { Exception } from '@/types';

export const AvailabilityExceptions = ({
  mentor,
  refetchMentor,
}: {
  mentor: Mentor;
  refetchMentor: () => void;
}) => {
  const [errorExceptionalDates, setErrorExceptionalDates] = useState<
    boolean | { errorExceptionalDates: ExceptionDateSlot[] }
  >(false);

  const [availabilityExceptions, setAvailabilityExceptions] = useState<Exception[]>([]);

  const [startAvailabilityExceptions, setStartAvailabilityExceptions] = useState<
    Maybe<ExceptionDateSlot>[]
  >([]);

  const [disableSave, setDisableSave] = useState(true);
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  const { user } = useAuth();

  const [upsertExceptionDates, { loading: loadingExceptionDates }] =
    useMutation(UPSERT_EXCEPTION_DATES);

  const onSubmit = (availabilityExceptions: Exception) => {
    if (availabilityExceptions) {
      const exceptionDates = [];

      if (availabilityExceptions.slots.length) {
        for (const slot of availabilityExceptions.slots) {
          const { id, date, from, to } = slot ?? {};
          exceptionDates.push({
            id: !Number.isNaN(Number(id)) ? id : null,
            date,
            from,
            to,
          });
        }
      } else {
        exceptionDates.push({
          id: !Number.isNaN(Number(availabilityExceptions.id)) ? availabilityExceptions.id : null,
          date: availabilityExceptions.date,
          from: '',
          to: '',
        });
      }

      const changeAvailabilityExceptions = changeSlots(startAvailabilityExceptions, exceptionDates);

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
      const dates: Exception[] = [];
      const disabledDates = [];
      const startExceptionDates = [];

      for (const exceptionDate of mentor.exceptionDates) {
        const { id, date: unixDate, from, to } = exceptionDate ?? {};

        const defaultFrom = from ? from : '';
        const defaultTo = to ? to : '';

        const date = new Date(Number(unixDate)).toISOString().split('T')[0];

        const slots =
          from !== '' && to !== '' ? [{ id, date, from: defaultFrom, to: defaultTo }] : [];

        startExceptionDates.push({
          id,
          date,
          from: defaultFrom,
          to: defaultTo,
        });

        const existingSlot = dates.find((item) => item.date === date);
        if (existingSlot) {
          existingSlot.slots.push({
            id,
            date,
            from: defaultFrom,
            to: defaultTo,
          });
        } else {
          dates.push({
            id: id ? id : nanoid(),
            date,
            slots,
            from: defaultFrom,
            to: defaultTo,
          });

          disabledDates.push(parse(date, 'yyyy-MM-dd', new Date()));
        }
      }

      const filterDates = dates
        // .map((date) => {
        //   if (date.slots.some((slot) => slot.from === null && slot.to === null)) {
        //     return {
        //       ...date,
        //       slots: [
        //         {
        //           id: null,
        //           date: '',
        //           from: '',
        //           to: '',
        //         },
        //       ],
        //     };
        //   }
        //   return date;
        // })
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
              />
            );
          })}
        </ul>
      </div>

      {errorExceptionalDates && typeof errorExceptionalDates !== 'boolean' && (
        <AdaptiveDialog
          open={!!errorExceptionalDates}
          setOpen={(isOpen) => setErrorExceptionalDates(isOpen ? false : errorExceptionalDates)}
        >
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
                  {errorExceptionalDates.errorExceptionalDates.map((date: ExceptionDateSlot) => {
                    return (
                      <li key={date.date}>
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
