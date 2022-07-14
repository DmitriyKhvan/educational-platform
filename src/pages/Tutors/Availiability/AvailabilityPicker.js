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
const AvailabilityPicker = ({
  isAdmin,
  day,
  id,
  user_id,
  setGatherAvailabilities,
  gatherAvailabilities,
  disabled = false,
  setHasValidTimes,
  newRow
}) => {
  const dispatch = useDispatch()
  const { removeAvailabilityRow } = useContext(AvailProv)
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
        timeType === 'from'
          ? setFromTime(formatTime(time))
          : setToTime(formatTime(time))
      }
    } else {
      // New
      if (typeof time === 'number') {
        let cpyCurrentData = [...currentData] || []
        cpyCurrentData[iteration][timeType] = formatTime(time)
        setCurrentData(cpyCurrentData || [])
      }
    }
  }
  const formatTime = time => {
    return moment.utc(time * 1000).format('HH:mm')
  }
  /**
   * function to help validate times selected by the tutor.
   * to -> from time and from -> to time (next row) are sequential */
  const validateTimesSelected = (availability, day) => {
    /* flat map the time slots array **/
    const timeSlots = availability.flatMap(v => {
      if (v.day === day) {
        return v.slots
      }
    })
    for (let i = 0; i <= timeSlots.length; i++) {
      if (timeSlots[i]?.from > timeSlots[i]?.to) {
        setHasValidTimes(true)
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.'
          ),
          t
        )
        return
      } else if (timeSlots[i + 1]?.from < timeSlots[i]?.to) {
        NotificationManager.error(
          t(
            'Failed to set time. Please make sure times selected are sequential.'
          ),
          t
        )
        setHasValidTimes(true)
        return
      } else {
        setHasValidTimes(false)
      }
    }
  }
  useEffect(() => {
    const from = fromTime
    const to = toTime
    const avail = { id, day, slots: [{ from, to }] }
    setGatherAvailabilities([...gatherAvailabilities, avail])
    for (const availability of gatherAvailabilities) {
      const availId = availability.id
      if (availId === id) {
        availability.slots[0] = { from, to }
        setGatherAvailabilities(gatherAvailabilities)
        validateTimesSelected(gatherAvailabilities, day)
      }
    }
  }, [fromTime, toTime])
  // this delete function is Set your teaching hours day
  const removeAvailabilityRows = (id, day, from, to) => {
    Swal.fire({
      title: t('swal_fire_title'),
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6133af',
      cancelButtonColor: '#d33',
      cancelButtonText: t('swal_cancel_Button_Text'),
      confirmButtonText: t('swal_confirm_Button_Text')
    }).then(result => {
      if (result.isConfirmed) {
        Swal.fire(
          t('swal_fire_title_conform_msg'),
          t('swal_fire_title_conform_msg1'),
          t('swal_fire_title_conform_msg2')
        )
        var index = 0
        gatherAvailabilities.map((data, i) => {
          if (
            data.day === day &&
            data.slots[0].from === from &&
            data.slots[0].to === to
          ) {
            index = i
          }
        })
        gatherAvailabilities.splice(index, 1)
        if (id) {
          setGatherAvailabilities(gatherAvailabilities)
        }
        dispatch(updateTutorAvailability(gatherAvailabilities, user_id))
        setCurrentData(tutorInfo.availabilities[day])
        setTimeout(() => {
          dispatch(getTutorInfo(user.tutor_profile.id))
        }, 1000)
      }
    })
  }
  return (
    <>
      {currentData?.length > 0 && newRow !== true ? (
        <>
          {currentData?.map((item, iteration) => {
            return (
              <div className='row mx-0 ' key={iteration}>
                <div className='col-auto align_time_img-time'>
                  <div className='d-flex'>
                    <TimePicker
                      className='time_picker text-center p-3'
                      start='09:00'
                      end='17:00'
                      step={30}
                      initialValue='09:00'
                      onChange={time => onChangeTime(time, iteration, 'from')}
                      value={item?.from || fromTime}
                    />
                  </div>
                </div>
                <div className='col-auto align-self-center pickerToText'>
                  <span className='text-muted availability_to_text'>TO</span>
                </div>
                <div className='col-auto align_time_img-time'>
                  <div className='d-flex '>
                    <TimePicker
                      className='time_picker text-center p-3'
                      start='09:00'
                      end='17:00'
                      step={30}
                      initialValue='17:00'
                      onChange={time => onChangeTime(time, iteration, 'to')}
                      value={item?.to || toTime}
                    />
                  </div>
                </div>

                <div className='col-auto align-self-center ms-3 '>
                  <button
                    type='button'
                    className='btn fa_trash_can pb-0'
                    disabled={iteration === 0 ? true : false}
                    onClick={() =>
                      removeAvailabilityRows(
                        iteration,
                        day,
                        item?.from,
                        item?.to
                      )
                    }
                  >
                    <img src={trashCan} className='fa_icon' alt='' />
                  </button>
                </div>
              </div>
            )
          })}
        </>
      ) : (
        <>
          <div className='row mx-0'>
            <div className='col-auto align_time_img-time over_form'>
              <div className='d-flex '>
                <TimePicker
                  className='time_picker text-center p-3 '
                  start='09:00'
                  end='17:00'
                  step={30}
                  initialValue='09:00'
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
                  start='09:00'
                  end='17:00'
                  step={30}
                  initialValue='17:00'
                  onChange={time => onChangeTime(time, 'newTime', 'to')}
                  value={toTime}
                />
              </div>
            </div>
            <div className='col-auto align-self-center '>
              <button
                type='button'
                className='btn fa_trash_can ms-3 pb-0 align_delete'
                onClick={() => removeAvailabilityRow({ id })}
                disabled={disabled}
              >
                <img src={trashCan} className='fa_icon' alt='' />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default AvailabilityPicker
