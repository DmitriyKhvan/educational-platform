import { useState } from 'react';
import { startOfDay, addMinutes, format } from 'date-fns';
import Select from 'react-select';
import { PiTrashFill } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa';

export const AvailabilityExceptionSlot = ({
  exception,
  slot,
  availabilityExceptionSlots,
}) => {
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const temp = addMinutes(startOfDay(new Date()), i * 30);
    return {
      label: format(temp, 'hh:mm a'),
      // value: 1800 * i,
      value: format(temp, 'HH:mm'),
    };
  });

  const [fromTime] = useState(
    timeOptions.find((time) => time.value === slot.from),
  );
  const [toTime] = useState(timeOptions.find((time) => time.value === slot.to));

  const onChangeTime = (time, timeType) => {
    const findTime = timeOptions.find((t) => t.value === time);

    // const slots = []

    availabilityExceptionSlots({
      id: exception.id,
      idSlot: slot.id,
      timeType,
      time: findTime,
    });
  };

  return (
    <div className="row mx-0">
      <div className="col-auto align_time_img-time over_form">
        <div className="d-flex ">
          <Select
            className="time_picker text-center "
            value={fromTime}
            options={timeOptions}
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
            options={timeOptions}
            onChange={(e) => {
              onChangeTime(e.value, 'to');
            }}
          />
        </div>
      </div>

      <div className="col-auto align-self-center ">
        <button
          type="button"
          className="btn fa_trash_can ms-3 align_delete"
          // onClick={() => removeRowDown(type)}
        >
          <PiTrashFill className="text-2xl text-color-border-grey" />
        </button>
      </div>

      <div className="col-auto align_fa_trash">
        <button
          className="btn fa_trash_can ms-3"
          // onClick={() => addAvailRowUp(day, 'availability')}
          // disabled={isTimeEndReached()}
        >
          <FaPlus className="text-2xl text-color-purple" />
        </button>
      </div>
    </div>
  );
};
