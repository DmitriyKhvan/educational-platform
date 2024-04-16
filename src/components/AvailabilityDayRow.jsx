import React, { useState, useEffect, useMemo } from 'react';
import AvailabilityPicker from '../pages/Mentors/Availiability/AvailabilityPicker';
import plusIcon from '../assets/images/plus_icon.svg';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { MentorAvailabilityType } from 'src/constants/global';
import { timesOfDay } from 'src/pages/Mentors/Availiability/lib/timesOfDay';
import { formatTime } from 'src/pages/Mentors/Availiability/lib/formatTime';
import { formatTimeToSeconds } from 'src/pages/Mentors/Availiability/lib/formatTimeToSeconds';
import { timeGroup } from 'src/pages/Mentors/Availiability/lib/timeGroup';
import { timeGroups } from 'src/pages/Mentors/Availiability/lib/timeGroups';

import '../assets/styles/availability.scss';

const AvailabilityDayRow = ({
  day,
  setGatherAvailabilities,
  allGatherAvailabilities, // trial/regular availabilities
  gatherAvailabilities,
  AvailabilitySlots,
  mentorAvailabilityType,
}) => {
  const [toggle, setToggle] = useState(false);
  const [timeGroupsSort, setTimeGroupsSort] = useState([]);

  const [t] = useTranslation('common');

  useEffect(() => {
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

  const timeOptionsSort =
    useMemo(() => {
      if (allGatherAvailabilities) {
        const availType =
          mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
            ? MentorAvailabilityType.ONLY_TRIAL
            : MentorAvailabilityType.ONLY_REGULAR;

        const timeOptionsSort = timesOfDay(
          allGatherAvailabilities[availType],
          day,
        );

        // divide into arrays of continuous time intervals
        const tGroups = timeGroups(allGatherAvailabilities[availType], day);

        setTimeGroupsSort(tGroups);

        return timeOptionsSort;
      }
    }, [allGatherAvailabilities, mentorAvailabilityType]) || [];

  const onToggleDay = (event) => {
    const value = event.target.checked;
    const firstTimeGroup = timeGroupsSort[0];

    setToggle(value);

    if (value) {
      const newAvailabilities = [
        ...gatherAvailabilities,
        {
          id: uuid(),
          day,
          slots: [
            {
              from: formatTime(firstTimeGroup[0].value),
              to: formatTime(firstTimeGroup[firstTimeGroup.length - 1].value),
            },
          ],
        },
      ];
      setGatherAvailabilities(newAvailabilities, mentorAvailabilityType);
    } else {
      setGatherAvailabilities(
        gatherAvailabilities.filter((q) => q.day !== day),
        mentorAvailabilityType,
      );
    }
  };

  const isTimeEndReached = () => {
    const currentData = gatherAvailabilities.filter((el) => el.day === day);
    return currentData[currentData.length - 1]?.slots[0]?.to >= '23:30';
  };

  const addAvailRowUpFn = () => {
    const daySlots = gatherAvailabilities.filter((aval) => aval.day === day);

    const fromTime = timeOptionsSort.find(
      (time) =>
        time.value >
        formatTimeToSeconds(daySlots[daySlots.length - 1].slots[0].to),
    );

    const tGroup = timeGroup(timeGroupsSort, fromTime.value);

    const toTime = tGroup[tGroup.length - 1];

    const newAvailabilities = [
      ...gatherAvailabilities,
      {
        id: uuid(),
        day,
        slots: [
          {
            from: formatTime(fromTime.value),
            to: formatTime(toTime.value),
          },
        ],
      },
    ];
    setGatherAvailabilities(newAvailabilities, mentorAvailabilityType);
  };

  return (
    <div className="row form-switch justify-content-md-center py-3 border-availabilities-picker">
      <input
        className="form-check-input mt-3 align_Toggle text-color-purple"
        type="checkbox"
        name={day}
        checked={toggle}
        onChange={
          timeOptionsSort[0]?.label === '11:30 PM' ? undefined : onToggleDay
        }
        disabled={timeOptionsSort[0]?.label === '11:30 PM'}
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
                    frmTime={k.slots[0].from}
                    tTime={k.slots[0].to}
                    AvailabilitySlots={AvailabilitySlots}
                    mentorAvailabilityType={mentorAvailabilityType}
                    timeOptionsSort={timeOptionsSort}
                    timeGroupsSort={timeGroupsSort}
                  />
                );
              }
            })}
          </div>
          <div className="col-auto align_fa_trash">
            <button
              className="btn fa_trash_can ms-3"
              onClick={addAvailRowUpFn}
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
