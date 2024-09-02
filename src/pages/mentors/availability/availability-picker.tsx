import { formatTime } from '@/pages/mentors/availability/lib/format-time';
import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { selectStyle } from '@/pages/mentors/availability/lib/select-style';
import { timeGroup } from '@/pages/mentors/availability/lib/time-group';
import { timeOptions } from '@/pages/mentors/availability/lib/time-options';
import type { TimeOption } from '@/types';
import type { InputMaybe, TimesheetSlot } from '@/types/types.generated';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import Select from 'react-select';

const AvailabilityPicker = ({
  id,
  frmTime,
  tTime,
  useSetGatherAvailabilities,
  gatherAvailabilities,
  timeOptionsSort,
  timeGroupsSort,
}: {
  id: InputMaybe<string> | undefined;
  frmTime: string;
  tTime: string;
  useSetGatherAvailabilities: (data: TimesheetSlot[]) => void;
  gatherAvailabilities: TimesheetSlot[];
  timeOptionsSort: TimeOption[];
  timeGroupsSort: TimeOption[][];
}) => {
  const [timeGroupSort, setTimeGroupSort] = useState<TimeOption[]>(
    timeGroup(timeGroupsSort, formatTimeToSeconds(frmTime)),
  );

  const [fromTimeOptions] = useState<TimeOption[]>(timeOptionsSort.slice(0, -1));
  const [toTimeOptions, setToTimeOptions] = useState<TimeOption[]>(timeGroupSort.slice(1));

  const fromTime = useMemo(() => {
    return timeOptions.find((time) => time.value === formatTimeToSeconds(frmTime));
  }, [frmTime]);

  const toTime = useMemo(() => {
    return timeOptions.find((time) => time.value === formatTimeToSeconds(tTime));
  }, [tTime]);

  const prevTimeGroupSortRef = useRef<TimeOption[]>();

  useEffect(() => {
    prevTimeGroupSortRef.current = timeGroupSort;
  }, [timeGroupSort]);

  const onChangeTime = (time: number, timeType: 'from' | 'to') => {
    const t = Number.parseInt(String(time));

    const newTimeGroupSort = timeGroup(timeGroupsSort, t);
    setTimeGroupSort(newTimeGroupSort);
    setToTimeOptions(newTimeGroupSort.slice(1));

    const idxTime = newTimeGroupSort.findIndex((item) => item.value === t);

    if (timeType === 'from') {
      if (newTimeGroupSort[idxTime]?.value >= (toTime?.value || 0)) {
        // setToTime(newTimeGroupSort[idxTime + 1]);
        updateAvailability(formatTime(t), formatTime(newTimeGroupSort[idxTime + 1]?.value), id);
      } else {
        let updatedToTime = tTime;
        if (JSON.stringify(prevTimeGroupSortRef.current) !== JSON.stringify(newTimeGroupSort)) {
          updatedToTime = formatTime(newTimeGroupSort[idxTime + 1]?.value);
        }
        updateAvailability(formatTime(t), updatedToTime, id);
      }
    } else {
      if (newTimeGroupSort[idxTime].value <= (fromTime?.value || 0)) {
        updateAvailability(formatTime(newTimeGroupSort[idxTime - 1].value), formatTime(t), id);
      } else {
        updateAvailability(frmTime, formatTime(t), id);
      }
    }
  };

  const updateAvailability = (
    fromTime: string,
    toTime: string,
    id: InputMaybe<string> | undefined,
  ) => {
    const idx = gatherAvailabilities.findIndex((a) => a?.id === id);

    const updateAvail = {
      ...gatherAvailabilities[idx],
      from: fromTime,
      to: toTime,
    };

    if (idx !== -1) {
      const data = [
        ...gatherAvailabilities.slice(0, idx),
        updateAvail,
        ...gatherAvailabilities.slice(idx + 1),
      ];
      useSetGatherAvailabilities(data);
    }
  };

  const removeAvailability = (id: InputMaybe<string> | undefined) => {
    const idx = gatherAvailabilities.findIndex((avail: TimesheetSlot) => avail?.id === id);

    if (idx !== -1) {
      let data = gatherAvailabilities.filter((avail) => avail.id !== id);

      if (!Number.isNaN(Number(id))) {
        //If id from Database
        const removeAvail = {
          ...gatherAvailabilities[idx],
          from: '',
          to: '',
          day: '',
        };

        data = [
          ...gatherAvailabilities.slice(0, idx),
          removeAvail,
          ...gatherAvailabilities.slice(idx + 1),
        ];
      }

      useSetGatherAvailabilities(data);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        menuPlacement="auto"
        styles={selectStyle}
        value={fromTime}
        options={fromTimeOptions}
        onChange={(e) => {
          onChangeTime(e?.value || 0, 'from');
        }}
      />

      <span>-</span>

      <Select
        menuPlacement="auto"
        styles={selectStyle}
        value={toTime}
        options={toTimeOptions}
        onChange={(e) => {
          onChangeTime(e?.value || 0, 'to');
        }}
      />

      <button
        type="button"
        // onClick={() => useSetGatherAvailabilities(gatherAvailabilities.filter((q) => q.id !== id))}
        onClick={() => removeAvailability(id)}
      >
        <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
      </button>
    </div>
  );
};

export default AvailabilityPicker;
