import { useState } from 'react';
import { startOfDay, addMinutes, format, parse } from 'date-fns';
import { v4 as uuid } from 'uuid';
import Select from 'react-select';
import { PiTrashFill } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa';
import Alert from 'src/components/Popup/Alert';
import { useTranslation } from 'react-i18next';

export const AvailabilityExceptionSlot = ({
  index,
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
      if (timeOptions[findTimeIdx].value >= toTime.value) {
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
      if (timeOptions[findTimeIdx].value <= fromTime.value) {
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

  const addAvailabilityExceptionSlot = () => {
    const from = toTime.value;
    const to = format(
      addMinutes(parse(toTime.value, 'HH:mm', new Date()), 60),
      'HH:mm',
    );

    const newTime = { id: uuid(), from, to };

    const newSlots = [...exception.slots, newTime];

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
    <div className="row mx-0">
      <div className="col-auto align_time_img-time over_form">
        <div className="d-flex ">
          <Select
            className="time_picker text-center "
            value={fromTime}
            options={fromTimeOptions}
            onChange={(e) => {
              onChangeTime(e.value, 'from');
            }}
          />
        </div>
      </div>

      <div className="col-auto align-self-center pickerToText ">
        <span className="text-muted availability_to_text over_to_text">TO</span>
      </div>
      <div className="col-auto align_time_img-time over_to">
        <div className="d-flex ">
          <Select
            className="time_picker text-center"
            value={toTime}
            options={toTimeOptions}
            onChange={(e) => {
              onChangeTime(e.value, 'to');
            }}
          />
        </div>
      </div>

      <div className="col-auto">
        <button
          type="button"
          className="btn ms-3 "
          onClick={removeAvailabilityExceptionSlotConfirm}
        >
          <PiTrashFill className="text-2xl text-color-border-grey" />
        </button>
      </div>

      {index === exception.slots.length - 1 && (
        <div className="col-auto">
          <button
            className="btn ms-3"
            onClick={addAvailabilityExceptionSlot}
            disabled={slot.to >= '23:30'}
          >
            <FaPlus className="text-2xl text-color-purple" />
          </button>
        </div>
      )}
    </div>
  );
};
