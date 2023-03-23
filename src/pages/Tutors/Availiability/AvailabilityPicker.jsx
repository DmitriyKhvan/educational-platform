import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { AvailProv } from './AvailabilityProvider'
import NotificationManager from '../../../components/NotificationManager'
import TimePicker from 'react-bootstrap-time-picker'
import trashCan from '../../../assets/images/trash_can.svg'
import Swal from 'sweetalert2'
import { getTutorInfo, updateTutorAvailability } from '../../../actions/tutor'
import VectorColor from '../../../assets/images/Vector-color.svg'
import VectorLess from '../../../assets/images/Vector-arrow-less.svg'
import Alert from '../../../components/Popup/Alert'
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
  const [fromTime, setFromTime] = useState('09:00')
  const [toTime, setToTime] = useState('17:00')
  const [currentData, setCurrentData] = useState([])

  useEffect(() => {
    setCurrentData(tutorInfo.availabilities[day])
  }, [tutorInfo])

  const onChangeTime = (time, iteration, timeType) => {
    if (iteration) {
      // Existing
      if (typeof time === 'number') {
       
        if(timeType === 'from'){
          setFromTime(formatTime(time))
          AvailabilitySlots(formatTime(time),toTime,String(id),day)
        }else{
          setToTime(formatTime(time))
          updateTime(formatTime(time))
          AvailabilitySlots(fromTime,formatTime(time),String(id),day)
        }
      }
    } else {
      // New
      if (typeof time === 'number') {
        let cpyCurrentData = [...currentData] || []
        cpyCurrentData[iteration][timeType] = formatTime(time)
        AvailabilitySlots(cpyCurrentData[iteration].from,cpyCurrentData[iteration].to,id,day)
        setCurrentData(cpyCurrentData || [])
      }
    }
  }
  const formatTime = time => {
    return moment.utc(time * 1000).format('HH:mm')
  }

  useEffect(()=>{
      if(frmTime!== undefined){
        setFromTime(frmTime)
      }
      if(tTime!== undefined){
        setToTime(tTime)
      }
      
      if(updateTime!==undefined){
        updateTime(toTime)
      }
  },[frmTime,tTime])
  
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

  return (
    <>

        <>
          <div className='row mx-0'>
            <div className='col-auto align_time_img-time over_form'>
              <div className='d-flex '>
                <TimePicker
                  className='time_picker text-center p-3 '
                  step={30}
                  onChange={time => onChangeTime(time, 'newTime', 'from')}
                  value={fromTime}
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
                <TimePicker
                  className='time_picker text-center p-3'
                  step={30}
                  onChange={time => onChangeTime(time, 'newTime', 'to')}
                  value={toTime}
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
        </>
      {/* )} */}
    </>
  )
}
export default AvailabilityPicker
