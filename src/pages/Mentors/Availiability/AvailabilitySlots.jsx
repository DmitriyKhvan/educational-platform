import { useMemo, useState, useEffect } from 'react';
import {
  DAYS,
  MentorAvailabilityType,
  timezoneWithTimeOptions,
} from 'src/shared/constants/global';
import AvailabilityDayRow from './AvailabilityDayRow';
import Button from 'src/components/Form/Button';
import { SelectField } from 'src/components/Form/SelectField';
import { useTranslation } from 'react-i18next';
import { selectStyle } from './lib/selectStyle';
import { useAuth } from 'src/app/providers/AuthProvider';
import { useMutation } from '@apollo/client';
import ReactLoader from 'src/components/common/Loader';
import { UPSERT_TIMESHEETS } from 'src/shared/apollo/mutations/upsertTimesheets';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { ModalConfirm } from 'src/entities/ModalConfirm';
import { IoIosWarning } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { parseErrorMessage } from './lib/parseErrorMessage';
import notify from 'src/shared/utils/notify';

export const AvailabilitySlots = ({
  mentorInfo,
  gatherAvailabilities,
  mentorAvailabilityType,
  useSetGatherAvailabilities,
  refetchMentor,
  setError,
}) => {
  const [errorExceptionalDates, setErrorExceptionalDates] = useState(null);
  const { user } = useAuth();

  const [t] = useTranslation(['common', 'availability']);

  const [disableSave, handleDisableSave] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const timezoneWithTime = useMemo(() => {
    return timezoneWithTimeOptions;
  }, []);

  const [timeZone, setTimeZone] = useState(user?.timeZone);
  const [prevTimeZone, setPrevTimeZone] = useState(user?.timeZone);

  const [upsertTimesheets] = useMutation(UPSERT_TIMESHEETS);

  const parseAndSaveAvailabilities = (mentorAvailabilityType) => {
    // combines slots on repeating days
    const days = gatherAvailabilities[mentorAvailabilityType].reduce(
      (acc, curr) => {
        if (acc[curr.day] === undefined) acc[curr.day] = [...curr.slots];
        else acc[curr.day] = [...acc[curr.day], ...curr.slots];
        return acc;
      },
      {},
    );

    let parseSlots = [];

    for (const day in days) {
      parseSlots.push({
        day,
        slots: [...days[day].map((slot) => ({ from: slot.from, to: slot.to }))],
        trialTimesheet:
          mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
            ? false
            : true,
      });
    }

    return parseSlots;
  };

  useEffect(() => {
    handleDisableSave(false);
  }, [gatherAvailabilities, timeZone]);

  // saving data in DB using loader
  const onSubmit = async (e) => {
    setIsLoading(true);
    e.target.blur();

    let slotsToSave = [];

    if (
      mentorInfo.mentorAvailability === MentorAvailabilityType.REGULAR_AND_TRIAL
    ) {
      Object.keys(gatherAvailabilities).forEach((availType) => {
        const slots = parseAndSaveAvailabilities(availType);

        slotsToSave = [...slotsToSave, ...slots];
      });
    } else {
      slotsToSave = parseAndSaveAvailabilities(mentorInfo.mentorAvailability);
    }

    try {
      await upsertTimesheets({
        variables: {
          data: {
            mentorId: mentorInfo?.id,
            availabilities: slotsToSave,
            ...(timeZone && { timeZone }),
          },
        },
      });

      setPrevTimeZone(timeZone);
      handleDisableSave(true);
    } catch (error) {
      setError(error);
      setTimeZone(prevTimeZone);
      // await refetchUser();
      await refetchMentor();

      const parseError = parseErrorMessage(error);
      if (parseError) {
        setErrorExceptionalDates(parseError);
      } else {
        notify(error.message, 'error');
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

          <SelectField
            styles={selectStyle}
            value={timeZone}
            options={timezoneWithTime}
            onChange={setTimeZone}
          />

          <div className="flex">
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={disableSave}
              className=""
            >
              Save changes
            </Button>
          </div>
        </div>

        <div className="divider"></div>

        <div className="space-y-8">
          {DAYS.map((day) => (
            <AvailabilityDayRow
              key={day}
              day={day}
              useSetGatherAvailabilities={useSetGatherAvailabilities}
              allGatherAvailabilities={gatherAvailabilities}
              gatherAvailabilities={
                gatherAvailabilities[mentorAvailabilityType]
              }
              mentorAvailabilityType={mentorAvailabilityType}
            />
          ))}
        </div>
      </div>

      {errorExceptionalDates && (
        <AdaptiveDialog
          open={!!errorExceptionalDates}
          setOpen={setErrorExceptionalDates}
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
                    You have{' '}
                    <b>
                      {errorExceptionalDates.regularLessons} regular lesson(s)
                    </b>{' '}
                    scheduled
                  </p>
                )}
                {!!errorExceptionalDates.trialLessons && (
                  <p>
                    You have{' '}
                    <b>{errorExceptionalDates.trialLessons} trial lesson(s)</b>{' '}
                    scheduled
                  </p>
                )}
              </div>
            }
            btns={
              <div className="flex gap-3">
                <Link className="basis-1/2" to="/mentor/lesson-calendar">
                  <Button
                    className="w-full"
                    onClick={() => setErrorExceptionalDates(null)}
                  >
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
