import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DAY,
  MentorAvailabilityType,
  timezoneWithTimeOptions,
} from '../../../constants/global';

import AvailabilityDayRow from '../../../components/AvailabilityDayRow';
import { AvailabilityProvider } from './AvailabilityProvider';
import NotificationManager from '../../../../src/components/NotificationManager';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../../modules/auth';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_MENTOR,
  MUTATION_UPDATE_USER,
} from '../../../modules/auth/graphql';
import { UPSERT_AVAILIABILITY } from './graphql';
import ReactLoader from '../../../components/common/Loader';
import Loader from '../../../components/Loader/Loader';
import notify from 'src/utils/notify';
import Button from 'src/components/Form/Button';
import { AcceptingStudents } from './AcceptingStudents';
import { cn } from 'src/utils/functions';
import { selectStyle } from './lib/selectStyle';
import { SelectField } from 'src/components/Form/SelectField';
import { AvailabilityExceptions } from '../AvailabilityExceptions/AvailabilityExceptions';

const Availability = () => {
  const { user, refetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: { mentor: mentorInfo } = {},
    loading: loadingMentor,
    // refetch: refetchMentor,
  } = useQuery(GET_MENTOR, {
    fetchPolicy: 'no-cache',
    variables: { id: user?.mentor?.id },
  });

  const [updateUser] = useMutation(MUTATION_UPDATE_USER);

  const [t] = useTranslation(['common', 'availability']);
  const selectSettings = useMemo(() => selectStyle(), []);

  useEffect(() => {
    if (mentorInfo) {
      const mentorType =
        mentorInfo.mentorAvailability === MentorAvailabilityType.ONLY_REGULAR ||
        mentorInfo.mentorAvailability ===
          MentorAvailabilityType.REGULAR_AND_TRIAL
          ? MentorAvailabilityType.ONLY_REGULAR
          : MentorAvailabilityType.ONLY_TRIAL;

      setMentorAvailabilityType(mentorType);
    }
  }, [mentorInfo]);

  const [mentorAvailabilityType, setMentorAvailabilityType] = useState();

  const [gatherAvailabilities, setGatherAvailabilities] = useState({
    [MentorAvailabilityType.ONLY_REGULAR]: [],
    [MentorAvailabilityType.ONLY_TRIAL]: [],
  });

  // for debugging
  const [hasValidTimes, setHasValidTimes] = useState(false);
  const [disableSave, handleDisableSave] = useState(true);
  const [isteachAddHours, setIsTeachAddHours] = useState([]);

  const timezoneWithTime = useMemo(() => {
    return timezoneWithTimeOptions;
  }, []);

  const [timeZone, setTimeZone] = useState(user?.timeZone);

  const [upsertAvailiability] = useMutation(UPSERT_AVAILIABILITY);

  useEffect(() => {
    if (mentorInfo?.availabilities?.regular.length) {
      const parseAvailRegular = mentorInfo?.availabilities?.regular.map(
        (slot) => {
          return {
            id: uuid(),
            day: slot.day,
            slots: [slot],
          };
        },
      );

      storeAvailablitiy(parseAvailRegular, MentorAvailabilityType.ONLY_REGULAR);
    }

    if (mentorInfo?.availabilities?.trial.length) {
      const parseAvailTrial = mentorInfo?.availabilities?.trial.map((slot) => {
        return {
          id: uuid(),
          day: slot.day,
          slots: [slot],
        };
      });

      storeAvailablitiy(parseAvailTrial, MentorAvailabilityType.ONLY_TRIAL);
    }
  }, [mentorInfo]);

  const regularAvailabilityHandler = () => {
    setMentorAvailabilityType(MentorAvailabilityType.ONLY_REGULAR);
  };

  const trialAvailabilityHandler = () => {
    setMentorAvailabilityType(MentorAvailabilityType.ONLY_TRIAL);
  };

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

      await upsertAvailiability({
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

  const validateTimesSelected = (availability, day) => {
    /* flat map the time slots array **/
    const timeSlots = availability.flatMap((v) => {
      if (v.day === day) {
        return v.slots;
      }
    });
    for (let i = 0; i < timeSlots.length; i++) {
      if (timeSlots[i]?.from >= timeSlots[i]?.to) {
        setHasValidTimes(true);
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.',
          ),
          t,
        );
        return;
      } else if (timeSlots[i + 1]?.from < timeSlots[i]?.to) {
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.',
          ),
          t,
        );
        setHasValidTimes(true);
        return;
      } else if (
        timeSlots[i] != undefined &&
        timeSlots[i]?.from === timeSlots[i]?.to
      ) {
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.',
          ),
          t,
        );
        setHasValidTimes(true);
        return;
      } else {
        setHasValidTimes(false);
      }
    }
  };

  //Adds, removes, updates timespans for days
  const AvailabilitySlots = (fromTime, toTime, id, day) => {
    const from = fromTime;
    const to = toTime;
    const avail = { id, day, slots: [{ from, to }] };

    const idx = gatherAvailabilities[mentorAvailabilityType].findIndex(
      (avail) => avail.id === id,
    );

    if (idx !== -1) {
      const data = gatherAvailabilities[mentorAvailabilityType].toSpliced(
        idx,
        1,
        avail,
      );
      storeAvailablitiy(data, mentorAvailabilityType);
    }
  };

  const storeAvailablitiy = (data, type) => {
    if (type) {
      setGatherAvailabilities((gatherAvailabilities) => {
        return {
          ...gatherAvailabilities,
          [type]: data,
        };
      });
    } else {
      setGatherAvailabilities(data);
    }
  };

  useEffect(() => {
    handleDisableSave(false);
  }, [gatherAvailabilities, timeZone]);

  if (loadingMentor) {
    return <Loader height="calc(100vh - 80px)" />;
  }

  return (
    <div className="space-y-10">
      {isLoading && <ReactLoader />}

      <h2 className="text-[32px] text-color-dark-purple font-bold leading-9">
        My Availability
      </h2>

      <div className="relative w-full flex items-center after:content-[''] after:absolute after:bottom-0 after:w-full after:h-[2px] after:bg-gray-100 after:-z-10">
        {mentorInfo.mentorAvailability ===
        MentorAvailabilityType.REGULAR_AND_TRIAL ? (
          <>
            <button
              className={cn(
                'p-5 text-[15px] font-medium border-b-2 border-transparent',
                mentorAvailabilityType ===
                  MentorAvailabilityType.ONLY_REGULAR &&
                  'text-color-purple border-color-purple',
              )}
              onClick={regularAvailabilityHandler}
            >
              Regular Students
            </button>
            <button
              className={cn(
                'p-5 text-[15px] font-medium border-b-2 border-transparent',
                mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL &&
                  'text-color-purple border-color-purple',
              )}
              onClick={trialAvailabilityHandler}
            >
              Trial Students
            </button>
          </>
        ) : mentorInfo.mentorAvailability ===
          MentorAvailabilityType.ONLY_TRIAL ? (
          <button
            className={cn(
              'p-5 text-[15px] font-medium border-b-2 border-transparent',
              mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL &&
                'text-color-purple border-color-purple',
            )}
            onClick={trialAvailabilityHandler}
          >
            Trial Students
          </button>
        ) : null}
      </div>

      <AcceptingStudents />

      <div className="flex flex-wrap gap-6">
        <div className="space-y-8 p-6 border border-gray-100 rounded-lg shadow-[0px_0px_8px_0px_rgba(0,_0,_0,_0.08)]">
          <div className="flex justify-between">
            <div className="space-y-2">
              <h1 className="text-xl text-color-dark-purple font-bold">
                {t('weekly_hours', { ns: 'availability' })}
              </h1>
              <h3 className="text-sm text-gray-400">
                {t('edit_your_shedule_below', { ns: 'availability' })}
              </h3>
            </div>

            <SelectField
              styles={selectSettings}
              value={timeZone}
              options={timezoneWithTime}
              onChange={setTimeZone}
            />
          </div>

          <div className="divider"></div>

          <div className="space-y-8">
            {DAY.map((day) => (
              <AvailabilityProvider
                key={day}
                setGatherAvailabilities={storeAvailablitiy}
                gatherAvailabilities={
                  gatherAvailabilities[mentorAvailabilityType]
                }
                setIsTeachAddHours={setIsTeachAddHours}
                AvailabilitySlots={AvailabilitySlots}
                day={day}
                isteachAddHours={isteachAddHours}
                mentorAvailabilityType={mentorAvailabilityType}
                validateTimesSelected={validateTimesSelected}
              >
                <AvailabilityDayRow
                  day={day}
                  setGatherAvailabilities={storeAvailablitiy}
                  allGatherAvailabilities={gatherAvailabilities}
                  gatherAvailabilities={
                    gatherAvailabilities[mentorAvailabilityType]
                  }
                  hasValidTimes={hasValidTimes}
                  setHasValidTimes={setHasValidTimes}
                  isteachAddHours={isteachAddHours}
                  setIsTeachAddHours={setIsTeachAddHours}
                  AvailabilitySlots={AvailabilitySlots}
                  mentorAvailabilityType={mentorAvailabilityType}
                />
              </AvailabilityProvider>
            ))}
            <div className="flex">
              <Button
                type="submit"
                onClick={onSubmit}
                // disabled={hasValidTimes || disableSave}
                disabled={disableSave}
                className="w-[15%]"
              >
                {t('save', { ns: 'common' })}
              </Button>
            </div>
          </div>
        </div>

        <AvailabilityExceptions />
      </div>
    </div>
  );
};

export default Availability;
