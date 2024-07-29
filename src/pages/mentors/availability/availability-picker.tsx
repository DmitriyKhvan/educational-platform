import { formatTime } from '@/pages/mentors/availability/lib/format-time';
import { formatTimeToSeconds } from '@/pages/mentors/availability/lib/format-time-to-seconds';
import { selectStyle } from '@/pages/mentors/availability/lib/select-style';
import { timeGroup } from '@/pages/mentors/availability/lib/time-group';
import { timeOptions } from '@/pages/mentors/availability/lib/time-options';
import type { Availability, TimeOption } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { FaXmark } from 'react-icons/fa6';
import Select from 'react-select';

const AvailabilityPicker = ({
  day,
  id,
  frmTime,
  tTime,
  useSetGatherAvailabilities,
  gatherAvailabilities,
  timeOptionsSort,
  timeGroupsSort,
}: {
  day: string;
  id: string;
  frmTime: string;
  tTime: string;
  useSetGatherAvailabilities: (data: Availability[]) => void;
  gatherAvailabilities: Availability[];
  timeOptionsSort: TimeOption[];
  timeGroupsSort: TimeOption[][];
}) => {
  const [timeGroupSort, setTimeGroupSort] = useState<TimeOption[]>(
    timeGroup(timeGroupsSort, formatTimeToSeconds(frmTime)),
  );

  const [fromTimeOptions] = useState<TimeOption[]>(timeOptionsSort.slice(0, -1));
  const [toTimeOptions, setToTimeOptions] = useState<TimeOption[]>(timeGroupSort.slice(1));

  const [fromTime, setFromTime] = useState<TimeOption | undefined>(
    timeOptions.find((time) => time.value === formatTimeToSeconds(frmTime)),
  );

  const [toTime, setToTime] = useState<TimeOption | undefined>(
    timeOptions.find((time) => time.value === formatTimeToSeconds(tTime)),
  );

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
      setFromTime(newTimeGroupSort[idxTime]);

      if (newTimeGroupSort[idxTime]?.value >= (toTime?.value || 0)) {
        setToTime(newTimeGroupSort[idxTime + 1]);
        updateAvailability(
          formatTime(t),
          formatTime(newTimeGroupSort[idxTime + 1]?.value),
          id,
          day,
        );
      } else {
        let updatedToTime = tTime;
        if (JSON.stringify(prevTimeGroupSortRef.current) !== JSON.stringify(newTimeGroupSort)) {
          updatedToTime = formatTime(newTimeGroupSort[idxTime + 1]?.value);
          setToTime(newTimeGroupSort[idxTime + 1]);
        }
        updateAvailability(formatTime(t), updatedToTime, id, day);
      }
    } else {
      setToTime(newTimeGroupSort[idxTime]);

      if (newTimeGroupSort[idxTime].value <= (fromTime?.value || 0)) {
        setFromTime(newTimeGroupSort[idxTime - 1]);
        updateAvailability(formatTime(newTimeGroupSort[idxTime - 1].value), formatTime(t), id, day);
      } else {
        updateAvailability(frmTime, formatTime(t), id, day);
      }
    }
  };

  const updateAvailability = (fromTime: string, toTime: string, id: string, day: string) => {
    const avail = { id, day, slots: [{ from: fromTime, to: toTime }] };

    const idx = gatherAvailabilities.findIndex((a) => a?.id === id);

    if (idx !== -1) {
      const data = [
        ...gatherAvailabilities.slice(0, idx),
        avail,
        ...gatherAvailabilities.slice(idx + 1),
      ];
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
        onClick={() => useSetGatherAvailabilities(gatherAvailabilities.filter((q) => q.id !== id))}
      >
        <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
      </button>
    </div>
  );
};

export default AvailabilityPicker;
