import { useState } from 'react';
import { startOfDay, addMinutes, format } from 'date-fns';

import Select from 'react-select';
import { selectStyle } from '../Availiability/lib/selectStyle';
import { FaXmark } from 'react-icons/fa6';

export const AvailabilityExceptionSlot = ({
  exception,
  slot,
  setException,
}) => {
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const temp = addMinutes(startOfDay(new Date()), i * 30);
    return {
      label: format(temp, 'hh:mm a'),
      time: 1800 * i,
      value: format(temp, 'HH:mm'),
    };
  });

  const [fromTimeOptions, setFromTimeOptions] = useState([
    ...timeOptions.slice(0, -1),
  ]);
  const [toTimeOptions, setToTimeOptions] = useState([...timeOptions]);

  const [fromTime, setFromTime] = useState(
    timeOptions.find((time) => time.value === slot.from),
  );

  const [toTime, setToTime] = useState(
    timeOptions.find((time) => time.value === slot.to),
  );

  const onChangeTime = (time, timeType) => {
    const findTimeIdx = timeOptions.findIndex((t) => t.value === time);

    let newTime = { ...slot, [timeType]: time };

    const slotIdx = exception.slots.findIndex((sl) => sl.id === slot.id);

    if (timeType === 'from') {
      const newToTimeOptions = timeOptions.slice(findTimeIdx + 1);
      setToTimeOptions(newToTimeOptions);

      setFromTime(timeOptions[findTimeIdx]);

      // if fromTime >= toTime
      if (timeOptions[findTimeIdx].value >= toTime?.value) {
        setToTime(timeOptions[findTimeIdx + 1]);
        newTime = {
          ...slot,
          from: time,
          to: timeOptions[findTimeIdx + 1].value,
        };
      }
    } else {
      const newFromTimeOptions = timeOptions.slice(0, findTimeIdx);
      setFromTimeOptions(newFromTimeOptions);

      setToTime(timeOptions[findTimeIdx]);

      // if toTime <= fromTime
      if (timeOptions[findTimeIdx].value <= fromTime?.value) {
        setFromTime(timeOptions[findTimeIdx - 1]);
        newTime = {
          ...slot,
          from: timeOptions[findTimeIdx - 1].value,
          to: time,
        };
      }
    }

    const newSlots = [
      ...exception.slots.slice(0, slotIdx),
      newTime,
      ...exception.slots.slice(slotIdx + 1),
    ];

    const newException = { ...exception, slots: newSlots };

    setException(newException);
  };

  const removeAvailabilityExceptionSlot = () => {
    const newSlots = exception.slots.filter((sl) => sl.id !== slot.id);

    const newException = { ...exception, slots: newSlots };

    setException(newException);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        // menuPortalTarget={document.body}
        styles={selectStyle}
        value={fromTime}
        options={fromTimeOptions}
        onChange={(e) => {
          onChangeTime(e.value, 'from');
        }}
        menuPlacement="auto"
      />

      <span className="">-</span>

      <Select
        // menuPortalTarget={document.body}
        styles={selectStyle}
        value={toTime}
        options={toTimeOptions}
        onChange={(e) => {
          onChangeTime(e.value, 'to');
        }}
        menuPlacement="auto"
      />

      <button type="button" onClick={removeAvailabilityExceptionSlot}>
        <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
      </button>
    </div>
  );
};
