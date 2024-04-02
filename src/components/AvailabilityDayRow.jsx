import React, { useContext, useState, useEffect, useMemo } from 'react';
import AvailabilityPicker from '../pages/Mentors/Availiability/AvailabilityPicker';
import { AvailProv } from '../pages/Mentors/Availiability/AvailabilityProvider';
import plusIcon from '../assets/images/plus_icon.svg';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import '../assets/styles/availability.scss';
import { MentorAvailabilityType } from 'src/constants/global';

const AvailabilityDayRow = ({
  day,
  setGatherAvailabilities,
  allGatherAvailabilities, // trial/regular availabilities
  gatherAvailabilities,
  setHasValidTimes,
  isteachAddHours,
  setIsTeachAddHours,
  newRow,
  AvailabilitySlots,
  mentorAvailabilityType,
}) => {
  const [toggle, setToggle] = useState(false);
  const { removeAvailabilityRow } = useContext(AvailProv);
  const { addAvailRowUp } = useContext(AvailProv);
  const [t] = useTranslation('common');

  useEffect(() => {
    console.log('gatherAvailabilities', gatherAvailabilities);
    console.log('allGatherAvailabilities', allGatherAvailabilities);

    var days = [];
    if (gatherAvailabilities.length > 0) {
      gatherAvailabilities.map((data, index) => {
        days.push(data.day);
        if (data.day === day) {
          if (toggle === false) {
            setToggle(true);
          }
        }
        if (gatherAvailabilities.length - 1 === index) {
          if (!days.includes(day)) {
            setToggle(false);
          }
        }
      });
    }
    if (gatherAvailabilities.length === 0) {
      if (!days.includes(day)) {
        setToggle(false);
      }
    }
  }, [gatherAvailabilities]);

  const busyDay = useMemo(() => {
    if (allGatherAvailabilities) {
      const availType =
        mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
          ? MentorAvailabilityType.ONLY_TRIAL
          : MentorAvailabilityType.ONLY_REGULAR;

      const allDay = allGatherAvailabilities[availType].filter((el) => {
        return el.day === day;
      });

      return allDay;
    }
  }, [mentorAvailabilityType]);

  console.log('busyDay', busyDay);

  const onToggleDay = () => {
    setToggle(!toggle);
    if (!toggle) {
      removeAvailabilityRow({ day });

      const obj = [
        ...gatherAvailabilities,
        { id: uuid(), day, slots: [{ from: '09:00', to: '17:00' }] },
      ];
      setGatherAvailabilities(obj, mentorAvailabilityType);
    }

    if (toggle === true) {
      setGatherAvailabilities(
        gatherAvailabilities.filter((q) => q.day !== day),
        mentorAvailabilityType,
      );
    }
  };

  const isTimeEndReached = () => {
    const currentData = gatherAvailabilities.filter((el) => el.day === day);
    return currentData[currentData.length - 1]?.slots?.[0]?.to >= '23:30';
  };

  return (
    <div className="row form-switch justify-content-md-center py-3 border-availabilities-picker">
      <input
        className="form-check-input mt-3 align_Toggle text-color-purple"
        type="checkbox"
        name={day}
        checked={toggle}
        onChange={busyDay.length > 0 ? undefined : onToggleDay}
        disabled={busyDay.length > 0}
      />
      <div className="col-sm-2 ms-3 me-5 align_day">
        <div>
          <strong>{t(day)}</strong>
        </div>
      </div>
      {toggle && (
        <>
          <div className="col-auto justify-content-md-center aligns_row_time">
            {gatherAvailabilities.map((k) => {
              if (k.day === day) {
                return (
                  <AvailabilityPicker
                    day={day}
                    key={k.id}
                    id={k.id}
                    setGatherAvailabilities={setGatherAvailabilities}
                    gatherAvailabilities={gatherAvailabilities}
                    setHasValidTimes={setHasValidTimes}
                    newRow={newRow}
                    frmTime={k.slots[0].from}
                    tTime={k.slots[0].to}
                    isteachAddHours={isteachAddHours}
                    setIsTeachAddHours={setIsTeachAddHours}
                    AvailabilitySlots={AvailabilitySlots}
                    mentorAvailabilityType={mentorAvailabilityType}
                  />
                );
              }
            })}
          </div>
          <div className="col-auto align_fa_trash">
            <button
              className="btn fa_trash_can ms-3"
              onClick={() => addAvailRowUp(day, mentorAvailabilityType)}
              disabled={isTimeEndReached()}
            >
              <img className="plus_button" src={plusIcon} alt="" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
export default AvailabilityDayRow;
