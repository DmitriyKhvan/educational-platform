import { useAuth } from '@/app/providers/auth-provider';
import ReactLoader from '@/components/common/loader';
import Button from '@/components/form/button';
import { SelectField } from '@/components/form/select-field';
import { ModalConfirm } from '@/entities/modal-confirm/ui/modal-confirm';
import AvailabilityDayRow from '@/pages/mentors/availability/availability-day-row';
import { parseErrorMessage } from '@/pages/mentors/availability/lib/parse-error-message';
import { selectStyle } from '@/pages/mentors/availability/lib/select-style';
import { useUpsertTimesheetsMutation } from '@/shared/apollo/mutations/timesheets/upsert-timesheets.generated';
import type { MentorQuery } from '@/shared/apollo/queries/mentors/mentor.generated';

import { DAY, timezoneWithTimeOptions } from '@/shared/constants/global';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import notify from '@/shared/utils/notify';
import type { ErrorExceptionalDates, GatherAvailabilities } from '@/types';
import {
  MentorAvailabilityType,
  type Exact,
  type Mentor,
  type TimesheetSlot,
} from '@/types/types.generated';
import type { ApolloQueryResult } from '@apollo/client';
import { type Dispatch, type SetStateAction, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosWarning } from 'react-icons/io';
import { Link } from 'react-router-dom';

export const AvailabilitySlots = ({
  mentorInfo,
  startAvailabilities,
  gatherAvailabilities,
  mentorAvailabilityType = MentorAvailabilityType.OnlyRegular,
  useSetGatherAvailabilities,
  refetchMentor,
  setError,
}: {
  mentorInfo: Mentor;
  startAvailabilities: TimesheetSlot[];
  gatherAvailabilities: GatherAvailabilities;
  mentorAvailabilityType?: MentorAvailabilityType;
  useSetGatherAvailabilities: (data: TimesheetSlot[]) => void;
  refetchMentor: (
    variables?:
      | Partial<
          Exact<{
            id: string;
          }>
        >
      | undefined,
  ) => Promise<ApolloQueryResult<MentorQuery>>;
  setError: Dispatch<SetStateAction<Error | null>>;
}) => {
  const [errorExceptionalDates, setErrorExceptionalDates] = useState<null | ErrorExceptionalDates>(
    null,
  );
  const { user, refetchUser } = useAuth();

  const [t] = useTranslation(['common', 'availability']);

  const [disableSave, handleDisableSave] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const timezoneWithTime = useMemo(() => {
    return timezoneWithTimeOptions;
  }, []);

  const [timeZone, setTimeZone] = useState(user?.timeZone);
  const [prevTimeZone, setPrevTimeZone] = useState(user?.timeZone);

  const [upsertTimesheets] = useUpsertTimesheetsMutation();

  useEffect(() => {
    handleDisableSave(false);
  }, [gatherAvailabilities, timeZone]);

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsLoading(true);
    e.currentTarget.blur();

    const updatedAvailabilities = [
      ...gatherAvailabilities[MentorAvailabilityType.OnlyRegular],
      ...gatherAvailabilities[MentorAvailabilityType.OnlyTrial],
    ].map((avail: TimesheetSlot) => {
      if (!Number.isNaN(Number(avail.id))) {
        return avail;
      }

      return {
        ...avail,
        id: null,
      };
    });

    //difference between two object arrays
    const changeAvailabilities = updatedAvailabilities.filter((updatedObj) => {
      const originalObj = startAvailabilities.find(
        (originalObj) => originalObj.id === updatedObj.id,
      );
      return !originalObj || !(JSON.stringify(originalObj) === JSON.stringify(updatedObj));
    });

    try {
      await upsertTimesheets({
        variables: {
          mentorId: mentorInfo?.id,
          timesheets: changeAvailabilities,
          ...(timeZone && { timezone: timeZone }),
        },
      });

      await refetchMentor();
      await refetchUser();
      setPrevTimeZone(timeZone);
      handleDisableSave(true);
    } catch (error) {
      setError(error as Error);

      setTimeZone(prevTimeZone);

      const parseError = parseErrorMessage(error as Error);
      if (parseError) {
        setErrorExceptionalDates(parseError);
      } else {
        notify((error as Error).message, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-fit space-y-8 p-6 border border-gray-100 rounded-lg shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
        {isLoading && <ReactLoader />}
        <div className="flex justify-between items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-xl text-color-dark-purple font-bold">
              {t('weekly_hours', { ns: 'availability' })}
            </h1>
            <h3 className="text-sm text-gray-400">
              {t('edit_your_shedule_below', { ns: 'availability' })}
            </h3>
          </div>

          {timeZone && (
            <SelectField
              styles={selectStyle}
              value={timeZone}
              options={timezoneWithTime}
              onChange={(value: string) => setTimeZone(value)}
            />
          )}

          <div className="flex">
            <Button type="submit" onClick={onSubmit} disabled={disableSave} className="">
              Save changes
            </Button>
          </div>
        </div>

        <div className="divider" />

        <div className="space-y-8">
          {DAY.map((day) => (
            <AvailabilityDayRow
              key={day}
              day={day}
              useSetGatherAvailabilities={useSetGatherAvailabilities}
              allGatherAvailabilities={gatherAvailabilities}
              gatherAvailabilities={gatherAvailabilities[mentorAvailabilityType]}
              mentorAvailabilityType={mentorAvailabilityType}
            />
          ))}
        </div>
      </div>

      {errorExceptionalDates && (
        <AdaptiveDialog
          open={!!errorExceptionalDates}
          setOpen={setErrorExceptionalDates as Dispatch<SetStateAction<boolean>>}
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
              <div>
                {!!errorExceptionalDates.regularLessons && (
                  <p>
                    You have <b>{errorExceptionalDates.regularLessons} regular lesson(s)</b>{' '}
                    scheduled
                  </p>
                )}
                {!!errorExceptionalDates.trialLessons && (
                  <p>
                    You have <b>{errorExceptionalDates.trialLessons} trial lesson(s)</b> scheduled
                  </p>
                )}
              </div>
            }
            btns={
              <div className="flex gap-3">
                <Link className="basis-1/2" to="/mentor/lesson-calendar">
                  <Button className="w-full" onClick={() => setErrorExceptionalDates(null)}>
                    Go to Lessons
                  </Button>
                </Link>

                <Button
                  onClick={() => setErrorExceptionalDates(null)}
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
