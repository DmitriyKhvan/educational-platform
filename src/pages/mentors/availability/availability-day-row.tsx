import React, { useState, useEffect, useMemo } from "react";
import AvailabilityPicker from "@/pages/mentors/availability/availability-picker";
import { formatTime } from "@/pages/mentors/availability/lib/format-time";
import { formatTimeToSeconds } from "@/pages/mentors/availability/lib/format-time-to-seconds";
import { timeGroup } from "@/pages/mentors/availability/lib/time-group";
import { timeGroups } from "@/pages/mentors/availability/lib/time-groups";
import { timesOfDay } from "@/pages/mentors/availability/lib/times-of-day";
import { useTranslation } from "react-i18next";
import { MentorAvailabilityType } from "@/shared/constants/global";
import { v4 as uuid } from "uuid";
import { LuPlus } from "react-icons/lu";
import Button from "@/components/form/button";
import CheckboxField from "@/components/form/checkbox-field";

type TimeSlot = {
  from: string;
  to: string;
};

type Availability = {
  id: string;
  day: string;
  slots: TimeSlot[];
};

type TimeOption = {
  label: string;
  value: number;
};

type AvailabilityDayRowProps = {
  day: string;
  useSetGatherAvailabilities: (availabilities: Availability[]) => void;
  allGatherAvailabilities: Record<string, Availability[]>; // trial/regular availabilities
  gatherAvailabilities: Availability[];
  mentorAvailabilityType: MentorAvailabilityType;
};

const AvailabilityDayRow: React.FC<AvailabilityDayRowProps> = ({
  day,
  useSetGatherAvailabilities,
  allGatherAvailabilities,
  gatherAvailabilities,
  mentorAvailabilityType,
}) => {
  const [toggle, setToggle] = useState(false);
  const [timeGroupsSort, setTimeGroupsSort] = useState<TimeOption[][]>([]);
  const [t] = useTranslation("common");

  useEffect(() => {
    const days = gatherAvailabilities.map((data) => data.day);
    setToggle(days.includes(day));
  }, [gatherAvailabilities, day]);

  const timeOptionsSort = useMemo(() => {
    if (allGatherAvailabilities) {
      const availType =
        mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
          ? MentorAvailabilityType.ONLY_TRIAL
          : MentorAvailabilityType.ONLY_REGULAR;

      const timeOptionsSort = timesOfDay(allGatherAvailabilities[availType], day);

      // divide into arrays of continuous time intervals
      const tGroups = timeGroups(allGatherAvailabilities[availType], day);
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
          slots: [
            {
              from: firstTimeGroup[0].label,
              to: firstTimeGroup[firstTimeGroup.length - 1].label,
            },
          ],
        },
      ];
      useSetGatherAvailabilities(newAvailabilities);
    } else {
      useSetGatherAvailabilities(gatherAvailabilities.filter((q) => q.day !== day));
    }
  };

  const isTimeEndReached = useMemo(() => {
    const currentData = gatherAvailabilities.filter((el) => el.day === day);
    return currentData[currentData.length - 1]?.slots[0]?.to >= "23:30";
  }, [gatherAvailabilities, day]);

  const addAvailRowUpFn = () => {
    const daySlots = gatherAvailabilities.filter((aval) => aval.day === day);
    const lastSlotToTime = daySlots[daySlots.length - 1].slots[0].to;

    const fromTime = timeOptionsSort.find(
      (time) => time.value > formatTimeToSeconds(lastSlotToTime)
    );

    if (!fromTime) return;

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
    useSetGatherAvailabilities(newAvailabilities);
  };


  return (
    <div className="flex items-start min-h-14 space-x-6">
      <div className="flex items-center w-[72px] h-14">
        <CheckboxField
          type="checkbox"
          name={day}
          checked={toggle}
          onChange={timeOptionsSort[0]?.label === "11:30 PM" ? undefined : onToggleDay}
          disabled={timeOptionsSort[0]?.label === "11:30 PM"}
          square
        />
        <span className="text-[15px] text-color-dark-purple font-bold uppercase ml-3">
          {t(day.slice(0, 3))}
        </span>
      </div>

      {toggle && (
        <>
          <div className="space-y-8">
            {gatherAvailabilities.map((k) =>
              k.day === day ? (
                <AvailabilityPicker
                  key={k.id}
                  day={day}
                  id={k.id}
                  frmTime={k.slots[0].from}
                  tTime={k.slots[0].to}
                  useSetGatherAvailabilities={useSetGatherAvailabilities}
                  gatherAvailabilities={gatherAvailabilities}
                  timeOptionsSort={timeOptionsSort}
                  timeGroupsSort={timeGroupsSort}
                />
              ) : null
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