import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { AvailProv } from './AvailabilityProvider'
import trashCan from '../../../assets/images/trash_can.svg'
import Alert from '../../../components/Popup/Alert'
import Select from 'react-select'
import { useForm } from 'react-hook-form'
import findIndex from 'lodash/findIndex';

const formatTime = time => {
  return moment.utc(time * 1000).format('HH:mm')
}

const formatTimeToSeconds = time => {
  const [hours, minutes] = time.split(':');
  return ((parseInt(hours) * 60 * 60) + (parseInt(minutes) * 60));
}

const times = [
  {
    timeType: "12:00 AM",
    time: 0
  },
  {
    timeType: "12:30 AM",
    time: 1800
  },

  {
    timeType: "01:00 AM",
    time: 3600
  },
  {
    timeType: "01:30 AM",
    time: 5400
  },
  {
    timeType: "02:00 AM",
    time: 7200
  },
  {
    timeType: "02:30 AM",
    time: 9000
  },
  {
    timeType: "03:00 AM",
    time: 10800
  },
  {
    timeType: "03:30 AM",
    time: 12600
  },
  {
    timeType: "04:00 AM",
    time: 14400
  },
  {
    timeType: "04:30 AM",
    time: 16200
  },
  {
    timeType: "05:00 AM",
    time: 18000
  },
  {
    timeType: "05:30 AM",
    time: 19800
  },
  {
    timeType: "06:00 AM",
    time: 21600
  },
  {
    timeType: "06:30 AM",
    time: 23400
  },
  {
    timeType: "07:00 AM",
    time: 25200
  },
  {
    timeType: "07:30 AM",
    time: 27000
  },
  {
    timeType: "08:00 AM",
    time: 28800
  },
  {
    timeType: "08:30 AM",
    time: 30600
  },
  {
    timeType: "09:00 AM",
    time: 32400
  },
  {
    timeType: "09:30 AM",
    time: 34200
  },
  {
    timeType: "10:00 AM",
    time: 36000
  },
  {
    timeType: "10:30 AM",
    time: 37800
  },
  {
    timeType: "11:00 AM",
    time: 39600
  },
  {
    timeType: "11:30 AM",
    time: 41400
  },
  {
    timeType: "12:00 PM",
    time: 43200
  },
  {
    timeType: "12:30 PM",
    time: 45000
  },
  {
    timeType: "01:00 PM",
    time: 46800
  },
  {
    timeType: "01:30 PM",
    time: 48600
  },
  {
    timeType: "02:00 PM",
    time: 50400
  },
  {
    timeType: "02:30 PM",
    time: 52200
  },
  {
    timeType: "03:00 PM",
    time: 54000
  },
  {
    timeType: "03:30 PM",
    time: 55800
  },
  {
    timeType: "04:00 PM",
    time: 57600
  },
  {
    timeType: "04:30 PM",
    time: 59400
  },
  {
    timeType: "05:00 PM",
    time: 61200
  },
  {
    timeType: "05:30 PM",
    time: 63000
  },
  {
    timeType: "06:00 PM",
    time: 64800
  },
  {
    timeType: "06:30 PM",
    time: 66600
  },
  {
    timeType: "07:00 PM",
    time: 68400
  },
  {
    timeType: "07:30 PM",
    time: 70200
  },
  {
    timeType: "08:00 PM",
    time: 72000
  },
  {
    timeType: "08:30 PM",
    time: 73800
  },
  {
    timeType: "09:00 PM",
    time: 75600
  },
  {
    timeType: "09:30 PM",
    time: 77400
  },
  {
    timeType: "10:00 PM",
    time: 79200
  },
  {
    timeType: "10:30 PM",
    time: 81000
  },
  {
    timeType: "11:00 PM",
    time: 82800
  },
  {
    timeType: "11:30 PM",
    time: 84600
  },
];

const timeOptions = times.map(({ timeType, time }) => {
  return { value: time, label: timeType };
});

const AvailabilityPicker = ({
  isAdmin,
  day,
  id,
  user_id,
  setGatherAvailabilities,
  gatherAvailabilities,
  disabled = false,
  setHasValidTimes,
  newRow,
  date,
  frmTime,
  tTime,
  updateTime,
  isteachAddHours,
  setIsTeachAddHours,
  setDisablePlusBtn,
  AvailabilitySlots,
  type
}) => {


  const dispatch = useDispatch()
   const { removeAvailabilityRow, availabilityRow } = useContext(AvailProv)
  const { t } = useTranslation()
  const tutorInfo = useSelector(state => state.tutor.info)
  const user = useSelector(state =>
    isAdmin ? state.admin.user : state.users.user
  )
  const [fromTime, setFromTime] = useState(frmTime)
  const [toTime, setToTime] = useState(tTime)
  const [currentData, setCurrentData] = useState([])

  const {
    control
  } = useForm()

  useEffect(() => {
    setCurrentData(tutorInfo.availabilities[day])
  }, [tutorInfo])

  const onChangeTime = (time, iteration, timeType) => {

    let t = parseInt(time)

    if (iteration) {
      // Existing

      if (typeof  t === 'number') {
       
        if(timeType === 'from'){
          setFromTime(formatTime( t))
          AvailabilitySlots(formatTime( t),toTime,String(id),day)
        }else{
          setToTime(formatTime( t))
          updateTime(formatTime( t))
          AvailabilitySlots(fromTime,formatTime( t),String(id),day)
        }
      }
    } else {
      // New
      if (typeof  t === 'number') {
        let cpyCurrentData = [...currentData] || []
        cpyCurrentData[iteration][timeType] = formatTime( t)
        console.log(cpyCurrentData)
        AvailabilitySlots(cpyCurrentData[iteration].from,cpyCurrentData[iteration].to,id,day)
        setCurrentData(cpyCurrentData || [])
      }
    }
  }

  useEffect(()=>{
      if(frmTime !== undefined){
        setFromTime(frmTime)
      }
      if(tTime !== undefined){
        setToTime(tTime)
      }
      
      if(updateTime !==undefined){
        updateTime(toTime)
      }
  },[frmTime,tTime, toTime, fromTime, setFromTime, setToTime])
  
  const removeRowDown = (type) => {
    Alert(
      t('swal_fire_title'),
      '',
      'warning',
      () => removeRows({id,day,type}),
      true,
      t('swal_confirm_Button_Text'),
      t('swal_cancel_Button_Text'),
      t('swal_fire_title_conform_msg'),
      t('swal_fire_title_conform_msg1'),
      t('swal_fire_title_conform_msg2')
    );
  }

  const removeRows = (item)=>{
    const data = availabilityRow[item.type];
  
    removeAvailabilityRow(item)
  }

  const fromTimeIndex = findIndex(timeOptions, { value: formatTimeToSeconds(fromTime) });
  const toTimeIndex = findIndex(timeOptions, { value: formatTimeToSeconds(toTime) });

  return (
    <div className='row mx-0 mt-2'>
      <div className='col-auto align_time_img-time over_form'>
        <div className='d-flex '>
          <Select
            className='time_picker text-center ' 
            defaultValue={timeOptions[fromTimeIndex]}
            options={timeOptions}
            onChange={e => {
              onChangeTime(e.value, 'newTime', 'from')
            }}
          />
        </div>
      </div>

      <div className='col-auto align-self-center pickerToText '>
        <span className='text-muted availability_to_text over_to_text'>
          TO
        </span>
      </div>
      <div className='col-auto align_time_img-time over_to'>
        <div className='d-flex '>
            <Select
            className='time_picker text-center' 
            defaultValue={timeOptions[toTimeIndex]}
            options={timeOptions}
            onChange={e => {
              onChangeTime(e.value, 'newTime', 'to')
            }}
          />
        </div>
      </div>
      <div className='col-auto align-self-center '>
        <button
          type='button'
          className='btn fa_trash_can ms-3 pb-0 align_delete'
          onClick={() => removeRowDown(type)}
        >
          <img src={trashCan} className='fa_icon' alt='' />
        </button>
      </div>
    </div>
  )
}
export default AvailabilityPicker
