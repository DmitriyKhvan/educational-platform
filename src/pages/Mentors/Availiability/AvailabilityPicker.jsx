import React, { useEffect, useState, useRef } from 'react';
import Select from 'react-select';

import { formatTimeToSeconds } from './lib/formatTimeToSeconds';
import { timeOptions } from './lib/timeOptions';
import { formatTime } from './lib/formatTime';
import { timeGroup } from './lib/timeGroup';
import { selectStyle } from './lib/selectStyle';
import { FaXmark } from 'react-icons/fa6';

const AvailabilityPicker = ({
  day,
  id,
  frmTime,
  tTime,
  useSetGatherAvailabilities,
  gatherAvailabilities,
  timeOptionsSort,
  timeGroupsSort,
}) => {
  const [timeGroupSort, setTimeGroupSort] = useState(
    timeGroup(timeGroupsSort, formatTimeToSeconds(frmTime)),
  );

  const [fromTimeOptions] = useState(timeOptionsSort.slice(0, -1));
  const [toTimeOptions, setToTimeOptions] = useState(timeGroupSort.slice(1));

  const [fromTime, setFromTime] = useState(
    timeOptions.find((time) => time.value === formatTimeToSeconds(frmTime)),
  );

  const [toTime, setToTime] = useState(
    timeOptions.find((time) => time.value === formatTimeToSeconds(tTime)),
  );

  const prevTimeGroupSortRef = useRef();

  // Remember the previous value every time the state is updated
  useEffect(() => {
    prevTimeGroupSortRef.current = timeGroupSort;
  }, [timeGroupSort]);

  const onChangeTime = (time, timeType) => {
    let t = parseInt(time);

    const timeGroupSort = timeGroup(timeGroupsSort, t);

    setTimeGroupSort(timeGroupSort);
    setToTimeOptions(timeGroupSort.slice(1));

    const idxTime = timeGroupSort.findIndex((item) => item.value === t);

    if (timeType === 'from') {
      setFromTime(timeGroupSort[idxTime]);

      //if fromTime >= toTime
      if (timeGroupSort[idxTime]?.value >= toTime.value) {
        setToTime(timeGroupSort[idxTime + 1]);

        updateAvailability(
          formatTime(t), // fromTime
          formatTime(timeGroupSort[idxTime + 1]?.value), // toTime
          String(id),
          day,
        );
      } else {
        let toTime = tTime;

        if (
          JSON.stringify(prevTimeGroupSortRef.current) !==
          JSON.stringify(timeGroupSort)
        ) {
          toTime = formatTime(timeGroupSort[idxTime + 1]?.value);
          setToTime(timeGroupSort[idxTime + 1]);
        }

        updateAvailability(formatTime(t), toTime, String(id), day);
      }
    } else {
      setToTime(timeGroupSort[idxTime]);

      //if toTime <= fromTime
      if (timeGroupSort[idxTime].value <= fromTime.value) {
        setFromTime(timeGroupSort[idxTime - 1]);
        updateAvailability(
          formatTime(timeGroupSort[idxTime - 1].value), //fromTime
          formatTime(t), //toTime
          String(id),
          day,
        );
      } else {
        updateAvailability(frmTime, formatTime(t), String(id), day);
      }
    }
  };

  const updateAvailability = (fromTime, toTime, id, day) => {
    const avail = { id, day, slots: [{ from: fromTime, to: toTime }] };

    const idx = gatherAvailabilities.findIndex((avail) => avail.id === id);

    if (idx !== -1) {
      const data = gatherAvailabilities.toSpliced(idx, 1, avail);
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
          onChangeTime(e.value, 'from');
        }}
      />

      <span className="">-</span>

      <Select
        menuPlacement="auto"
        styles={selectStyle}
        value={toTime}
        options={toTimeOptions}
        onChange={(e) => {
          onChangeTime(e.value, 'to');
        }}
      />

      <button
        onClick={() =>
          useSetGatherAvailabilities(
            gatherAvailabilities.filter((q) => q.id !== id),
          )
        }
      >
        <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
      </button>

      {/* <AdaptiveDialog
        button={
          <button>
            <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
          </button>
        }
      >
        <ModalConfirm
          title="Delete date availability slot"
          text="Are you sure you want to delete this date availability slot?"
          btns={
            <div className="flex gap-3">
              <Button
                theme="destructive"
                className="basis-1/2"
                onClick={() =>
                  useSetGatherAvailabilities(
                    gatherAvailabilities.filter((q) => q.id !== id),
                  )
                }
              >
                Yes, delete
              </Button>

              <Dialog.Close asChild>
                <Button theme="gray" className="basis-1/2">
                  Cancel
                </Button>
              </Dialog.Close>
            </div>
          }
        />
      </AdaptiveDialog> */}
    </div>
  );
};
export default AvailabilityPicker;
