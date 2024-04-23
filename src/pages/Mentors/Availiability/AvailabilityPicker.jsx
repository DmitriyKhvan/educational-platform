import React, { useEffect, useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { AvailProv } from './AvailabilityProvider';
import trashCan from '../../../assets/images/trash_can.svg';
import Alert from '../../../components/Popup/Alert';
import Select from 'react-select';
import { formatTimeToSeconds } from './lib/formatTimeToSeconds';
import { timeOptions } from './lib/timeOptions';
import { formatTime } from './lib/formatTime';
import { timeGroup } from './lib/timeGroup';

const AvailabilityPicker = ({
  day,
  id,
  frmTime,
  tTime,
  AvailabilitySlots,
  mentorAvailabilityType,
  timeOptionsSort,
  timeGroupsSort,
}) => {
  const { removeAvailabilityRow } = useContext(AvailProv);
  const { t } = useTranslation('modals');

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

  useEffect(() => {}, []);

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

        AvailabilitySlots(
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

        AvailabilitySlots(formatTime(t), toTime, String(id), day);
      }
    } else {
      setToTime(timeGroupSort[idxTime]);

      //if toTime <= fromTime
      if (timeGroupSort[idxTime].value <= fromTime.value) {
        setFromTime(timeGroupSort[idxTime - 1]);
        AvailabilitySlots(
          formatTime(timeGroupSort[idxTime - 1].value), //fromTime
          formatTime(t), //toTime
          String(id),
          day,
        );
      } else {
        AvailabilitySlots(frmTime, formatTime(t), String(id), day);
      }
    }
  };

  const removeRowDown = (mentorAvailabilityType) => {
    Alert(
      t('swal_fire_title'),
      '',
      'warning',
      () => removeAvailabilityRow({ id, day, mentorAvailabilityType }),
      true,
      t('swal_confirm_Button_Text'),
      t('swal_cancel_Button_Text'),
      t('swal_fire_title_conform_msg'),
      t('swal_fire_title_conform_msg1'),
      t('swal_fire_title_conform_msg2'),
    );
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
