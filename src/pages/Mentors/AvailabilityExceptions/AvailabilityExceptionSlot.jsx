import { useState } from 'react';
import { startOfDay, addMinutes, format } from 'date-fns';
// import { v4 as uuid } from 'uuid';
import Select from 'react-select';
// import { FaPlus } from 'react-icons/fa';
import Alert from 'src/components/Popup/Alert';
import { useTranslation } from 'react-i18next';
import { selectStyle } from '../Availiability/lib/selectStyle';
import { FaXmark } from 'react-icons/fa6';

export const AvailabilityExceptionSlot = ({
  // index,
  exception,
  slot,
  availabilityExceptionSlots,
}) => {
  const { t } = useTranslation('modals');

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

    availabilityExceptionSlots(newException);
  };

  const removeAvailabilityExceptionSlot = () => {
    const slotIdx = exception.slots.findIndex((sl) => sl.id === slot.id);

    const newSlots = [
      ...exception.slots.slice(0, slotIdx),
      ...exception.slots.slice(slotIdx + 1),
    ];

    const newException = { ...exception, slots: newSlots };

    availabilityExceptionSlots(newException);
  };

  const removeAvailabilityExceptionSlotConfirm = () => {
    Alert(
      t('swal_fire_title'),
      '',
      'warning',
      () => removeAvailabilityExceptionSlot(),
      true,
      t('swal_confirm_Button_Text'),
      t('swal_cancel_Button_Text'),
      t('swal_fire_title_conform_msg'),
      t('swal_fire_title_conform_msg1'),
      t('swal_fire_title_conform_msg2'),
    );
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        styles={selectStyle}
        value={fromTime}
        options={fromTimeOptions}
        onChange={(e) => {
          onChangeTime(e.value, 'from');
        }}
      />

      <span className="">-</span>

      <Select
        styles={selectStyle}
        value={toTime}
        options={toTimeOptions}
        onChange={(e) => {
          onChangeTime(e.value, 'to');
        }}
      />

      <button type="button" onClick={removeAvailabilityExceptionSlotConfirm}>
        <FaXmark className="text-gray-300 hover:text-color-dark-purple ease-in-out delay-150" />
      </button>
    </div>
  );
};
