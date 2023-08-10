// no alternative in graphql yet

/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef  */

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DAY } from '../../../constants/global';

// import { updateTutorAvailability } from '../../../actions/tutor';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faGear } from '@fortawesome/free-solid-svg-icons';
import AvailabilityDayRow from '../../../components/AvailabilityDayRow';
import { AvailabilityProvider } from './AvailabilityProvider';
import NotificationManager from '../../../../src/components/NotificationManager';
import { v4 as uuid } from 'uuid';
import { useAuth } from '../../../modules/auth';
// import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client';
import { GET_MENTOR } from '../../../modules/auth/graphql';
import { UPSERT_AVAILIABILITY } from './graphql';
import ReactLoader from '../../../components/common/Loader';
import Loader from '../../../components/Loader/Loader';

const Availability = (/*{ user_id  }*/) => {
  const [t] = useTranslation(['common', 'availability']);
  const [gatherAvailabilities, setGatherAvailabilities] = useState({
    exceptiondates: [],
    availability: [],
  });
  const [, setCurrentDatas] = useState([]);
  // for debugging
  const [hasValidTimes, setHasValidTimes] = useState(false);
  const [disableSave, handleDisableSave] = useState(true);
  const [isteachAddHours, setIsTeachAddHours] = useState([]);
  const [disablePlusBtn, setDisablePlusBtn] = useState(false);
  const [initialId, setInitialId] = useState();
  // tutor policies state and handler
  const [, setIsMonthCheck] = useState(false);
  // tutor policies state and handler
  const { user } = useAuth();
  const { data: { mentor: tutorInfo } = {}, loading: loadingMentor } = useQuery(
    GET_MENTOR,
    {
      fetchPolicy: 'no-cache',
      variables: { id: user?.mentor?.id },
    },
  );
  const [upsertAvailiability, { loading: loadingUpsertAvailiability, error }] =
    useMutation(UPSERT_AVAILIABILITY);

  const [currentToTime, setCurrentToTime] = useState('16:00');

  useEffect(() => {
    setInitialId(uuid);
  }, []);

  useEffect(() => {
    var savedData = [];
    if (tutorInfo?.availabilities) {
      const slotsMap = tutorInfo.availabilities.reduce((map, slot) => {
        if (map[slot.day] === undefined) map[slot.day] = [slot];
        else map[slot.day] = [...map[slot.day], slot];
        return map;
      }, {});
      for (const day in slotsMap) {
        savedData.push({
          id: day,
          day,
          slots: slotsMap[day],
        });
      }
    }
    const tempData = [
      {
        id: initialId,
        day: undefined,
        slots: [{ from: '09:00', to: '17:00' }],
      },
    ];
    storeAvailablitiy({ exceptiondates: tempData, availability: savedData });
  }, [tutorInfo]);
  useEffect(() => {
    if (tutorInfo?.exceptiondates !== undefined) {
      var withId = [];
      let count = 0;
      tutorInfo.exceptiondates.map((data) => {
        var temp = { ...data };
        temp.id = ++count;
        withId.push(temp);
      });
      setCurrentDatas(withId);
    }
    const unique = [
      ...(tutorInfo?.exceptiondates
        ? new Set(tutorInfo?.exceptiondates.map((item) => item.date))
        : []),
    ];
    if (unique.length >= 9) {
      setIsMonthCheck(true);
    } else {
      setIsMonthCheck(false);
    }
  }, [tutorInfo]);

  // saving data in DB using loader
  const onSubmit = async (e) => {
    const days = gatherAvailabilities.availability.reduce((acc, curr) => {
      if (acc[curr.day] === undefined) acc[curr.day] = [...curr.slots];
      else acc[curr.day] = [...acc[curr.day], ...curr.slots];
      return acc;
    }, {});

    let isError = false;

    const slotsToSave = [];
    for (const day in days) {
      slotsToSave.push({
        day,
        slots: [...days[day].map((slot) => ({ from: slot.from, to: slot.to }))],
      });
      days[day].map((slot, ind) => {
        if (
          slot.from >= slot.to ||
          (ind > 0 && days[day][ind - 1]?.to >= slot.from)
        ) {
          isError = true;
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please check your time slots',
          });
        }
      });
    }

    if (isError) {
      return;
    }

    setTimeout(() => {
      upsertAvailiability({
        variables: {
          data: {
            mentorId: tutorInfo.id,
            availabilities: slotsToSave,
          },
        },
      });
      e.target.blur();
      handleDisableSave(true);
    }, 500);
  };

  const [, setUserData] = useState({
    time_zone: '',
  });
  useEffect(() => {
    setUserData({
      time_zone: user.time_zone,
    });
  }, [user]);
  // timezone map looping
  // default time-zone is America/Los_Angeles (GMT-08:00)
  // date override date groupby date map

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

  const AvailabilitySlots = (fromTime, toTime, id, day) => {
    const from = fromTime;
    const to = toTime;
    const avail = { id, day, slots: [{ from, to }] };
    storeAvailablitiy(
      [...gatherAvailabilities.availability, ...[avail]],
      'availability',
    );
    const data = gatherAvailabilities.availability;
    for (const availability of data) {
      const availId = availability.id;
      if (availId === id) {
        if (to >= '23:30') {
          setDisablePlusBtn(true);
          // setIsTeachAddHours(true)
        } else {
          setDisablePlusBtn(false);
          // setIsTeachAddHours(false)
        }
        availability.slots[0] = { from, to };
        //validateTimesSelected(data, day)
        storeAvailablitiy(data, 'availability');
      }
    }
  };

  const storeAvailablitiy = (data, type) => {
    if (type) {
      handleDisableSave(false);
      setGatherAvailabilities({ ...gatherAvailabilities, [type]: data });
    } else {
      setGatherAvailabilities(data);
    }
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  if (loadingMentor) {
    return <Loader height="calc(100vh - 80px)" />;
  }

  return (
    <React.Fragment>
      {loadingUpsertAvailiability && <ReactLoader />}
      <div className="border-availabilities">
        <div className="container-fluid py-3">
          <div className="row ms-4">
            <div className="col-xs-12 col-md-8">
              <h1 className="title">
                {t('set_your_availability', { ns: 'availability' })}
              </h1>
              <h3>{t('edit_your_shedule_below', { ns: 'availability' })}</h3>
            </div>
            {/* <div className="col-xs-6 col-md-4 pe-5 text-end align-self-center">
              <Link
                to="/mentor/avail/settings"
                className="btn btn-default align-content-end"
                type="button"
              >
                <FontAwesomeIcon icon={faGear} size="1x" className="me-2" />
                <strong>{t('settings', { ns: 'common' })}</strong>
              </Link>
            </div> */}
          </div>
        </div>
      </div>
      <div className="container py-3 align-width_Availability">
        <h2 className="date_override_title">
          {t('set_your_teaching_hours', { ns: 'availability' })}
        </h2>
        <div className="container align-self-center remove-last-border">
          {DAY.map((day, i) => (
            <AvailabilityProvider
              key={i}
              setGatherAvailabilities={storeAvailablitiy}
              gatherAvailabilities={gatherAvailabilities.availability}
              setIsTeachAddHours={setIsTeachAddHours}
              disablePlusBtn={disablePlusBtn}
              setDisablePlusBtn={setDisablePlusBtn}
              AvailabilitySlots={AvailabilitySlots}
              day={day}
              isteachAddHours={isteachAddHours}
              type={'availability'}
              validateTimesSelected={validateTimesSelected}
            >
              <AvailabilityDayRow
                day={day}
                setGatherAvailabilities={storeAvailablitiy}
                gatherAvailabilities={gatherAvailabilities.availability}
                hasValidTimes={hasValidTimes}
                setHasValidTimes={setHasValidTimes}
                isteachAddHours={isteachAddHours}
                setIsTeachAddHours={setIsTeachAddHours}
                AvailabilitySlots={AvailabilitySlots}
                setCurrentToTime={setCurrentToTime}
                currentToTime={currentToTime}
                type={'availability'}
              />
            </AvailabilityProvider>
          ))}
          <div
            style={{ display: 'flex', justifyContent: 'end', maxWidth: '100%' }}
          >
            <button
              type="button"
              className="btn btn-secondary save_button"
              data-bs-dismiss="modal"
              onClick={onSubmit}
              disabled={hasValidTimes || disableSave}
            >
              <strong>{t('save', { ns: 'common' })}</strong>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Availability;
