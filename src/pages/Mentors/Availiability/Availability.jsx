import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DAY, MentorAvailabilityType } from '../../../constants/global';

import AvailabilityDayRow from '../../../components/AvailabilityDayRow';
import { AvailabilityProvider } from './AvailabilityProvider';
import NotificationManager from '../../../../src/components/NotificationManager';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../../modules/auth';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MENTOR } from '../../../modules/auth/graphql';
import { UPSERT_AVAILIABILITY } from './graphql';
import ReactLoader from '../../../components/common/Loader';
import Loader from '../../../components/Loader/Loader';
import notify from 'src/utils/notify';
import Button from 'src/components/Form/Button';

const Availability = () => {
  const [t] = useTranslation(['common', 'availability']);
  const [mentorAvailabilityType, setMentorAvailabilityType] = useState(
    MentorAvailabilityType.ONLY_REGULAR,
  );

  const [gatherAvailabilities, setGatherAvailabilities] = useState({
    [MentorAvailabilityType.ONLY_REGULAR]: [],
    [MentorAvailabilityType.ONLY_TRIAL]: [],
  });

  // for debugging
  const [hasValidTimes, setHasValidTimes] = useState(false);
  const [disableSave, handleDisableSave] = useState(true);
  const [isteachAddHours, setIsTeachAddHours] = useState([]);

  const { user } = useAuth();

  const {
    data: { mentor: mentorInfo } = {},
    loading: loadingMentor,
    refetch: refetchMentor,
  } = useQuery(GET_MENTOR, {
    fetchPolicy: 'no-cache',
    variables: { id: user?.mentor?.id },
  });

  const [upsertAvailiability, { loading: loadingUpsertAvailiability, error }] =
    useMutation(UPSERT_AVAILIABILITY);

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
    e.target.blur();

    let slotsToSave = [];
    Object.keys(gatherAvailabilities).forEach((availType) => {
      const slots = parseAndSaveAvailabilities(availType);

      slotsToSave = [...slotsToSave, ...slots];
    });

    setTimeout(() => {
      upsertAvailiability({
        variables: {
          data: {
            mentorId: mentorInfo?.id,
            availabilities: slotsToSave,
          },
        },
        onCompleted: () => {
          refetchMentor();
        },
      });

      handleDisableSave(true);
    }, 500);
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
      handleDisableSave(false);
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
    if (error) {
      notify(error.message, 'error');
    }
  }, [error]);

  if (loadingMentor) {
    return <Loader height="calc(100vh - 80px)" />;
  }

  return (
    <React.Fragment>
      {loadingUpsertAvailiability && <ReactLoader />}

      {mentorInfo.mentorAvailability ===
      MentorAvailabilityType.REGULAR_AND_TRIAL ? (
        <div className="w-auto flex items-center mb-4">
          <Button
            theme="outline"
            className={`relative ml-0 rounded-r-none focus:shadow-none ${
              mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR &&
              'bg-color-purple text-white'
            }`}
            onClick={regularAvailabilityHandler}
          >
            <span>Regular Students</span>
          </Button>
          <Button
            theme="outline"
            className={`relative ml-[-4px] rounded-l-none focus:shadow-none ${
              mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL &&
              'bg-color-purple text-white'
            }`}
            onClick={trialAvailabilityHandler}
          >
            <span>Trial Students</span>
          </Button>
        </div>
      ) : mentorInfo.mentorAvailability ===
        MentorAvailabilityType.ONLY_TRIAL ? (
        <Button
          theme="outline"
          className={`relative ml-[-4px] focus:shadow-none ${
            mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL &&
            'bg-color-purple text-white'
          }`}
          onClick={trialAvailabilityHandler}
        >
          <span>Trial Students</span>
        </Button>
      ) : null}

      <div className="border-availabilities">
        <div className="container-fluid py-3">
          <div className="row ms-4">
            <div className="col-xs-12 col-md-8">
              <h1 className="title">
                {t('set_your_availability', { ns: 'availability' })}
              </h1>
              <h3>{t('edit_your_shedule_below', { ns: 'availability' })}</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-3 align-width_Availability">
        <h2 className="date_override_title">
          {t('set_your_teaching_hours', { ns: 'availability' })}
        </h2>
        <div className="container align-self-center remove-last-border">
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
          <div className="flex justify-end">
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={hasValidTimes || disableSave}
              className="w-[15%] mt-5"
            >
              {t('save', { ns: 'common' })}
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Availability;
