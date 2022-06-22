import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { AvailProv } from './AvailabilityProvider'
import NotificationManager from '../../../components/NotificationManager'
import TimePicker from 'react-bootstrap-time-picker'
import trashCan from '../../../assets/images/trash_can.svg'

const AvailabilityPicker = ({
  isAdmin,
  day,
  id,
  setGatherAvailabilities,
  gatherAvailabilities,
  disabled = false,
  setHasValidTimes
}) => {
  const { removeAvailabilityRow } = useContext(AvailProv)
  const { t } = useTranslation()
  const tutorInfo = useSelector(state => state.tutor.info)
  const user = useSelector(state =>
    isAdmin ? state.admin.user : state.users.user
  )
  console.log({ tutorInfo })
  const [fromTime, setFromTime] = useState('09:00')
  const [toTime, setToTime] = useState('17:00')

  const onChangeFromTime = time => {
    // due to the design, we have to post on change to the DB for every time selection
    // we default to '09:00' (as DB requires a string)
    // on change grabs it as a number, we then need to format it into a string
    if (typeof time === 'number') {
      setFromTime(formatTime(time))
    } else {
      setFromTime(time)
    }
  }

  const onChangeToTime = time => {
    if (typeof time === 'number') {
      setToTime(formatTime(time))
    } else {
      setToTime(time)
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

  return (
    <div className='row mb-2'>
      <div className='col-sm-3'>
        <TimePicker
          className='time_picker text-center p-3'
          start='09:00'
          end='17:00'
          step={30}
          initialValue='09:00'
          onChange={onChangeFromTime}
          value={fromTime}
        />
      </div>

      <div className='col-sm-1 align-self-center pickerToText'>
        <span className='text-muted'>TO</span>
      </div>
      <div className='col-sm-3'>
        <TimePicker
          className='time_picker text-center p-3'
          start='09:00'
          end='17:00'
          step={30}
          initialValue='17:00'
          onChange={onChangeToTime}
          value={toTime}
        />
      </div>
      <div className='col-1 align-self-center ms-3'>
        <button
          type='button'
          className='btn fa_trash_can pb-0'
          onClick={() => removeAvailabilityRow({ id })}
          disabled={disabled}
        >
          <img src={trashCan} className='fa_icon' alt='' />
        </button>
      </div>
    </div>
  )
}

export default AvailabilityPicker
