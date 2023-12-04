import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { AvailProv } from './AvailabilityProvider';
import trashCan from '../../../assets/images/trash_can.svg';
import Alert from '../../../components/Popup/Alert';
import Select from 'react-select';
import findIndex from 'lodash-es/findIndex';
import { useAuth } from '../../../modules/auth';

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

console.log('timeOptions', timeOptions);

const AvailabilityPicker = ({
  day,
  id,
  frmTime,
  tTime,
  updateTime,
  AvailabilitySlots,
  type,
}) => {
  const { removeAvailabilityRow } = useContext(AvailProv);
  const { t } = useTranslation('modals');
  const [currentData, setCurrentData] = useState([]); //Why is it needed?
  const tutorInfo = useAuth().user.mentor;

  //Why is it needed?=======================
  useEffect(() => {
    if (tutorInfo.availabilities) setCurrentData(tutorInfo.availabilities[day]);
  }, [tutorInfo]);
  //========================================

  const onChangeTime = (time, iteration, timeType) => {
    let t = parseInt(time);

    console.log('time', time);

    if (iteration) {
      // Existing

      if (typeof t === 'number') {
        if (timeType === 'from') {
          AvailabilitySlots(formatTime(t), tTime, String(id), day);
        } else {
          updateTime(formatTime(t)); //I don't know what this method is for
          AvailabilitySlots(frmTime, formatTime(t), String(id), day);
        }
      }
      //This code will never work. Why is it needed?========================
    } else {
      // New
      if (typeof t === 'number') {
        let cpyCurrentData = [...currentData] || [];
        cpyCurrentData[iteration][timeType] = formatTime(t);
        AvailabilitySlots(
          cpyCurrentData[iteration].from,
          cpyCurrentData[iteration].to,
          id,
          day,
        );
        setCurrentData(cpyCurrentData || []);
      }
    }
    //========================================================================
  };

  const removeRowDown = (type) => {
    Alert(
      t('swal_fire_title'),
      '',
      'warning',
      () => removeRows({ id, day, type }),
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

  const fromTimeIndex = findIndex(timeOptions, {
    value: formatTimeToSeconds(frmTime),
  });
  const toTimeIndex = findIndex(timeOptions, {
    value: formatTimeToSeconds(tTime),
  });

  return (
    <div className="row mx-0 mt-2">
      <div className="col-auto align_time_img-time over_form">
        <div className="d-flex ">
          <Select
            className="time_picker text-center "
            defaultValue={timeOptions[fromTimeIndex]}
            options={timeOptions}
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
            defaultValue={timeOptions[toTimeIndex]}
            options={timeOptions}
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
          onClick={() => removeRowDown(type)}
        >
          <img src={trashCan} className="fa_icon" alt="" />
        </button>
      </div>
    </div>
  );
};
export default AvailabilityPicker;
