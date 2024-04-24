import React, { useState, useEffect, useMemo } from 'react';
import AvailabilityPicker from '../pages/Mentors/Availiability/AvailabilityPicker';

import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { MentorAvailabilityType } from 'src/constants/global';
import { timesOfDay } from 'src/pages/Mentors/Availiability/lib/timesOfDay';
import { formatTime } from 'src/pages/Mentors/Availiability/lib/formatTime';
import { formatTimeToSeconds } from 'src/pages/Mentors/Availiability/lib/formatTimeToSeconds';
import { timeGroup } from 'src/pages/Mentors/Availiability/lib/timeGroup';
import { timeGroups } from 'src/pages/Mentors/Availiability/lib/timeGroups';

import '../assets/styles/availability.scss';
import CheckboxField from './Form/CheckboxField';
import { LuPlus } from 'react-icons/lu';
import Button from './Form/Button';

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
    if (gatherAvailabilities?.length > 0) {
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
    if (gatherAvailabilities?.length === 0) {
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
    <div className="flex items-start min-h-14 space-x-6">
      <div className="flex items-center w-[72px] h-14">
        <CheckboxField
          type="checkbox"
          name={day}
          checked={toggle}
          onChange={
            timeOptionsSort[0]?.label === '11:30 PM' ? undefined : onToggleDay
          }
          disabled={timeOptionsSort[0]?.label === '11:30 PM'}
          square
        />

        <span className="text-[15px] text-color-dark-purple font-bold uppercase ml-3">
          {t(day.slice(0, 3))}
        </span>
      </div>

      {toggle && (
        <>
          <div className="space-y-8">
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

          <div className="flex items-center h-14">
            <Button
              theme="clear"
              className="flex items-center justify-center w-[32px] h-[32px] p-0 rounded-[4px] bg-[rgba(134,_46,_231,_0.20)]"
              onClick={addAvailRowUpFn}
              disabled={isTimeEndReached()}
            >
              <LuPlus className="text-color-purple" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
export default AvailabilityDayRow;
