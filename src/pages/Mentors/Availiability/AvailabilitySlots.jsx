import { useMemo, useState, useEffect } from 'react';
import {
  DAY,
  MentorAvailabilityType,
  timezoneWithTimeOptions,
} from 'src/constants/global';
import AvailabilityDayRow from './AvailabilityDayRow';
import Button from 'src/components/Form/Button';
import { SelectField } from 'src/components/Form/SelectField';
import { useTranslation } from 'react-i18next';
import { selectStyle } from './lib/selectStyle';
import notify from 'src/utils/notify';
import { useAuth } from 'src/modules/auth';
import { MUTATION_UPDATE_USER } from 'src/modules/auth/graphql';
import { useMutation } from '@apollo/client';
import ReactLoader from 'src/components/common/Loader';
import { UPSERT_TIMESHEETS } from 'src/modules/graphql/mutations/upsertTimesheets';

export const AvailabilitySlots = ({
  mentorInfo,
  gatherAvailabilities,
  mentorAvailabilityType,
  useSetGatherAvailabilities,
}) => {
  const { user, refetchUser } = useAuth();

  const [t] = useTranslation(['common', 'availability']);

  const [disableSave, handleDisableSave] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const timezoneWithTime = useMemo(() => {
    return timezoneWithTimeOptions;
  }, []);

  const [timeZone, setTimeZone] = useState(user?.timeZone);

  const [updateUser] = useMutation(MUTATION_UPDATE_USER);
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
      if (user.timeZone !== timeZone) {
        await updateUser({
          variables: {
            id: user?.id,
            data: {
              timeZone,
            },
          },
        });
      }

      await upsertTimesheets({
        variables: {
          data: {
            mentorId: mentorInfo?.id,
            availabilities: slotsToSave,
          },
        },
      });

      await refetchUser();

      handleDisableSave(true);
    } catch (error) {
      notify(error.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
  );
};
