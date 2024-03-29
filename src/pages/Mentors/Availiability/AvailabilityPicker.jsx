import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { AvailProv } from './AvailabilityProvider';
import trashCan from '../../../assets/images/trash_can.svg';
import Alert from '../../../components/Popup/Alert';
import Select from 'react-select';

const formatTime = (time) => {
  return moment.utc(time * 1000).format('HH:mm');
};

//converting time to seconds
const formatTimeToSeconds = (time) => {
  const [hours, minutes] = time.split(':');
  return parseInt(hours) * 60 * 60 + parseInt(minutes) * 60;
};

const times = Array.from({ length: 48 }, (_, i) => {
  const temp = moment
    .utc()
    .startOf('day')
    .add(i * 30, 'minutes');
  return {
    timeType: temp.format('hh:mm A'),
    time: 1800 * i,
  };
});

// Dictionary time slots
const timeOptions = times.map(({ timeType, time }) => {
  return { value: time, label: timeType };
});

const AvailabilityPicker = ({
  day,
  id,
  frmTime,
  tTime,
  AvailabilitySlots,
  mentorAvailabilityType,
}) => {
  const { removeAvailabilityRow } = useContext(AvailProv);
  const { t } = useTranslation('modals');

  const [fromTimeOptions, setFromTimeOptions] = useState([
    ...timeOptions.slice(0, -1),
  ]);
  const [toTimeOptions, setToTimeOptions] = useState([...timeOptions]);

  const [fromTime, setFromTime] = useState(
    timeOptions.find((time) => time.value === formatTimeToSeconds(frmTime)),
  );
  const [toTime, setToTime] = useState(
    timeOptions.find((time) => time.value === formatTimeToSeconds(tTime)),
  );

  const onChangeTime = (time, iteration, timeType) => {
    let t = parseInt(time);

    const idxTime = timeOptions.findIndex((t) => t.value === time);

    if (iteration) {
      // Existing

      if (typeof t === 'number') {
        if (timeType === 'from') {
          const newToTimeOptions = timeOptions.slice(idxTime + 1);
          setToTimeOptions(newToTimeOptions);
          setFromTime(timeOptions[idxTime]);

          //if fromTime >= toTime
          if (timeOptions[idxTime].value >= toTime.value) {
            setToTime(timeOptions[idxTime + 1]);
            AvailabilitySlots(
              formatTime(t), // fromTime
              formatTime(timeOptions[idxTime + 1].value), // toTime
              String(id),
              day,
            );
          } else {
            AvailabilitySlots(formatTime(t), tTime, String(id), day);
          }
        } else {
          const newFromTimeOptions = timeOptions.slice(0, idxTime);
          setFromTimeOptions(newFromTimeOptions);
          setToTime(timeOptions[idxTime]);

          //if toTime <= fromTime
          if (timeOptions[idxTime].value <= fromTime.value) {
            setFromTime(timeOptions[idxTime - 1]);
            AvailabilitySlots(
              formatTime(timeOptions[idxTime - 1].value), //fromTime
              formatTime(t), //toTime
              String(id),
              day,
            );
          } else {
            AvailabilitySlots(frmTime, formatTime(t), String(id), day);
          }
        }
      }
    }
  };

  const removeRowDown = (mentorAvailabilityType) => {
    Alert(
      t('swal_fire_title'),
      '',
      'warning',
      () => removeRows({ id, day, mentorAvailabilityType }),
      true,
      t('swal_confirm_Button_Text'),
      t('swal_cancel_Button_Text'),
      t('swal_fire_title_conform_msg'),
      t('swal_fire_title_conform_msg1'),
      t('swal_fire_title_conform_msg2'),
    );
  };

  const removeRows = (item) => {
    removeAvailabilityRow(item);
  };

  return (
    <div className="row mx-0 mt-2">
      <div className="col-auto align_time_img-time over_form">
        <div className="d-flex ">
          <Select
            className="time_picker text-center "
            value={fromTime}
            options={fromTimeOptions}
            onChange={(e) => {
              onChangeTime(e.value, 'newTime', 'from');
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
              onChangeTime(e.value, 'newTime', 'to');
            }}
          />
        </div>
      </div>
      <div className="col-auto align-self-center ">
        <button
          type="button"
          className="btn fa_trash_can ms-3 align_delete"
          onClick={() => removeRowDown(mentorAvailabilityType)}
        >
          <img src={trashCan} className="fa_icon" alt="" />
        </button>
      </div>
    </div>
  );
};
export default AvailabilityPicker;
