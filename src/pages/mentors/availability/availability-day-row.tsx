import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import AvailabilityPicker from '@/pages/mentors/availability/availability-picker';
import { formatTime } from '@/pages/mentors/availability/lib/format-time';
import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { timeGroup } from '@/pages/mentors/availability/lib/time-group';
import { timeGroups } from '@/pages/mentors/availability/lib/time-groups';
import { timesOfDay } from '@/pages/mentors/availability/lib/times-of-day';
import { MentorAvailabilityType } from '@/shared/constants/global';
import type { AvailabilityDayRowProps, TimeOption } from '@/types';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuPlus } from 'react-icons/lu';
import { v4 as uuid } from 'uuid';

const AvailabilityDayRow: React.FC<AvailabilityDayRowProps> = ({
  day,
  useSetGatherAvailabilities,
  allGatherAvailabilities,
  gatherAvailabilities,
  mentorAvailabilityType,
}) => {
  const [toggle, setToggle] = useState(false);
  const [timeGroupsSort, setTimeGroupsSort] = useState<TimeOption[][]>([]);
  const [t] = useTranslation('common');

  const filterAvailabilities = useMemo(() => {
    return gatherAvailabilities.filter((avail) => avail.from !== '' && avail.to !== '');
  }, [gatherAvailabilities]);

  useEffect(() => {
    const days = filterAvailabilities.map((data) => data.day);
    setToggle(days.includes(day));
  }, [filterAvailabilities, day]);

  const timeOptionsSort = useMemo(() => {
    if (allGatherAvailabilities) {
      const availType =
        mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
          ? MentorAvailabilityType.ONLY_TRIAL
          : MentorAvailabilityType.ONLY_REGULAR;

      const timeOptionsSort = timesOfDay(allGatherAvailabilities[availType], day);

      // divide into arrays of continuous time intervals
      const tGroups = timeGroups(allGatherAvailabilities[availType], day);
      console.log('day', day);
      console.log('tGroups', tGroups);
      // debugger

      setTimeGroupsSort(tGroups);

      return timeOptionsSort;
    }
    return [];
  }, [allGatherAvailabilities, mentorAvailabilityType, day]);

  const onToggleDay = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.checked;
    const firstTimeGroup = timeGroupsSort[0];

    setToggle(value);

    if (value && firstTimeGroup) {
      const newAvailabilities = [
        ...gatherAvailabilities,
        {
          id: uuid(),
          day,
          from: formatTime(firstTimeGroup[0].value),
          to: formatTime(firstTimeGroup[firstTimeGroup.length - 1].value),
          isTrial: mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL,
        },
      ];

      useSetGatherAvailabilities(newAvailabilities);
    } else {
      // debugger;
      const removeAvailabilitiesDay = gatherAvailabilities
        .filter((avail) => !(avail.day === day && Number.isNaN(Number(avail.id))))
        .map((avail) => {
          if (avail.day === day) {
            return { ...avail, from: '', to: '', day: '' };
          }
          return avail;
        });

      useSetGatherAvailabilities(removeAvailabilitiesDay);
    }
  };

  const isTimeEndReached = useMemo(() => {
    const currentData = gatherAvailabilities.filter((el) => el.day === day);
    return currentData[currentData.length - 1]?.to >= '23:30';
  }, [gatherAvailabilities, day]);

  const addAvailRowUpFn = () => {
    const daySlots = gatherAvailabilities.filter((aval) => aval.day === day);
    const lastSlotToTime = daySlots[daySlots.length - 1].to;

    const fromTime = timeOptionsSort.find(
      (time) => time.value > formatTimeToSeconds(lastSlotToTime),
    );

    if (!fromTime) return;

    const tGroup = timeGroup(timeGroupsSort, fromTime.value);
    const toTime = tGroup[tGroup.length - 1];

    const newAvailabilities = [
      ...gatherAvailabilities,
      {
        id: uuid(),
        day,
        from: formatTime(fromTime.value),
        to: formatTime(toTime.value),
        isTrial: mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL,
      },
    ];
    useSetGatherAvailabilities(newAvailabilities);
  };

  return (
    <div className="flex items-start min-h-14 space-x-6">
      <div className="flex items-center w-[72px] h-14">
        <CheckboxField
          type="checkbox"
          name={day}
          checked={toggle}
          onChange={timeOptionsSort[0]?.label === '11:30 PM' ? undefined : onToggleDay}
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
            {filterAvailabilities.map((k) =>
              k.day === day ? (
                <AvailabilityPicker
                  key={k.id}
                  id={k.id}
                  frmTime={k.from}
                  tTime={k.to}
                  useSetGatherAvailabilities={useSetGatherAvailabilities}
                  gatherAvailabilities={gatherAvailabilities}
                  timeOptionsSort={timeOptionsSort}
                  timeGroupsSort={timeGroupsSort}
                />
              ) : null,
            )}
          </div>

          <div className="flex items-center h-14">
            <Button
              theme="clear"
              className="flex items-center justify-center w-[32px] h-[32px] p-0 rounded-[4px] bg-[rgba(134,_46,_231,_0.20)]"
              onClick={addAvailRowUpFn}
              disabled={isTimeEndReached}
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
