import React, { useState } from 'react';
import { startOfDay, addMinutes, format } from 'date-fns';
import { DatePicker } from '@tremor/react';
import Select from 'react-select';
import { PiTrashFill } from 'react-icons/pi';
import { FaPlus } from 'react-icons/fa';
import Button from 'src/components/Form/Button';

export const AvailabilityExceptions = () => {
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const temp = addMinutes(startOfDay(new Date()), i * 30);
    return {
      label: format(temp, 'hh:mm a'),
      // value: 1800 * i,
      value: format(temp, 'HH:mm'),
    };
  });

  console.log(timeOptions);

  //converting time to seconds
  // const formatTimeToSeconds = (time) => {
  //   const [hours, minutes] = time.split(':');
  //   return parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
  // };

  const [fromTime, setFromTime] = useState(
    timeOptions.find((time) => time.value === '08:00'),
  );
  const [toTime, setToTime] = useState(
    timeOptions.find((time) => time.value === '21:00'),
  );

  const onChangeTime = (time, timeType) => {
    const findTime = timeOptions.find((t) => t.value === time);

    console.log('findTime', findTime);
    if (timeType === 'from') {
      setFromTime(findTime);
    } else {
      setToTime(findTime);
    }
  };

  const addAvailabilityException = () => {
    // day: 'Saturday';
    // from: '09:00';
    // id: 'Mentor:2:Saturday';
    // to: '23:30';
  };

  return (
    <div className="p-4 pb-11">
      <h2 className="date_override_title mb-3">Add date overrides</h2>

      <DatePicker className="max-w-sm rounded border mb-4" />

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
          <span className="text-muted availability_to_text over_to_text">
            TO
          </span>
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

      <Button
        onClick={addAvailabilityException}
        className="mt-4"
        theme="outline"
      >
        Add a date override
      </Button>
    </div>
  );
};
