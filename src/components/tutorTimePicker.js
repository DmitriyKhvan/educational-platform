import React, { useEffect, useState } from 'react'
import TimePicker from 'react-bootstrap-time-picker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getTutorInfo, updateTutorAvailability } from '../actions/tutor'

import moment from 'moment'
import { useTranslation } from 'react-i18next'
import NotificationManager from '../components/NotificationManager'

export const TutorTimePicker = ({ day, isAdmin, user_id }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [fromTime, setFromTime] = useState('09:00')
  const [toTime, setToFime] = useState('17:00')
  const [availabilities, setAvailabilities] = useState([
    {
      day,
      slots: [{ from: fromTime, to: toTime }]
    }
  ])
  const tutorInfo = useSelector(state => state.tutor.info)
  const user = useSelector(state =>
    isAdmin ? state.admin.user : state.users.user
  )

  const formatTime = time => {
    return moment.utc(time * 1000).format('HH:mm')
  }

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
      setToFime(formatTime(time))
    } else {
      setToFime(time)
    }
  }

  useEffect(() => {
    if (user && user.tutor_profile)
      dispatch(getTutorInfo(user.tutor_profile.id))
  }, [user])

  useEffect(() => {
    const from = fromTime
    const to = toTime
    setAvailabilities([
      {
        day,
        slots: [
          {
            from,
            to
          }
        ]
      }
    ])
  }, [fromTime, toTime])

  useEffect(() => {
    const hasValidTimes = validateTimeSelected(availabilities)
    if (hasValidTimes) {
      dispatch(updateTutorAvailability(availabilities, tutorInfo?.id))
    } else {
      NotificationManager.success(
        t('Failed to save time slot. Please check selected times.'),
        t
      )
    }
  }, [availabilities])

  const validateTimeSelected = availabilities => {
    let hasInvalidTime = true
    if (availabilities.length) {
      for (const { slots } of availabilities) {
        for (let i = 0; i < slots.length; i++) {
          if (slots[i].from > slots[i].to) {
            console.log('FROM TIME cannot be later than the TO TIME')
            hasInvalidTime = false
          }
          // if (slots[i].from > slots[i + 1].to) {
          //   console.log(
          //     'TO TIME (new row) must be greater than FROM TIME (previous row)'
          //   )
          //   hasInvalidTime = true
          // }
        }
      }
    }
    return hasInvalidTime
  }

  return (
    <div className='row  mb-2'>
      <div className='col-3'>
        <TimePicker
          className='time_picker text-center'
          start='09:00'
          end='17:00'
          step={30}
          initialValue='09:00'
          onChange={onChangeFromTime}
          value={fromTime}
        />
      </div>

      <div className='col-1 align-self-center text-center'>
        <span className='text-muted availability_to_text'>TO</span>
      </div>
      <div className='col-3'>
        <TimePicker
          className='time_picker text-center'
          start='09:00'
          end='17:00'
          step={30}
          initialValue='17:00'
          onChange={onChangeToTime}
          value={toTime}
        />
      </div>
      <div className='col-1 align-self-center ms-3'>
        <button type='button' className='btn fa_trash_can'>
          <FontAwesomeIcon icon={faTrashCan} className='fa_trash_can' />
        </button>
      </div>
    </div>
  )
}

export default TutorTimePicker
