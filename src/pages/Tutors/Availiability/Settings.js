import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import subLessonIcon from '../../../assets/images/sub_lessons_icon.svg'
import TutorApi from '../../../api/TutorApi'
import { Provider, useSelector } from 'react-redux'
import NotificationManager from '../../../components/NotificationManager'
import { useHistory } from 'react-router-dom'
const fedHolidays = require('@18f/us-federal-holidays')
export const Settings = () => {
  const [t] = useTranslation('translation')
  const history = useHistory()
  // states for handling switch toggled
  const [subBookings, setSubBookings] = useState(false)
  const [holidayBookings, setHolidayBookings] = useState(false)
  const [calendarConflicts, setCalendarConflicts] = useState(true)
  const [addCalendarLessons, setAddCalendarLessons] = useState(false)
  const [FederalHolidays, setFederalHolidays] = useState(false)
  const tutor_id = useSelector(state => state?.users?.user?.tutor_profile?.id)
  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true }
    const holidays = fedHolidays.allForYear(currentYear, options)
    var all_holidays = []
    holidays.map(data => {
      var temp = {}
      temp.date = data.date
      temp.slots = [
        {
          from: '12:00 AM',
          to: '11:00 PM'
        }
      ]
      all_holidays.push(temp)
    })

    setFederalHolidays(all_holidays)
    if (tutor_id !== undefined) {
      TutorApi.getExceptionDate(tutor_id).then(response => {
        if (response?.data?.tutor?.exceptiondates.length > 0) {
          setHolidayBookings(true)
        }
      })
    }
  }, [tutor_id])

  const toggleSubBookings = () => {
    setSubBookings(!subBookings)
  }
  const toggleHolidayBookings = () => {
    setHolidayBookings(!holidayBookings)
  }
  const toggleCalendarConflicts = () => {
    setCalendarConflicts(!calendarConflicts)
  }
  const toggleAddCalendarLessons = () => {
    setAddCalendarLessons(!addCalendarLessons)
  }
  const saveSettings = () => {
    if (holidayBookings === true) {
      TutorApi.updateExceptionDates(FederalHolidays, tutor_id).then(
        response => {
          if (response.status === 200) {
            NotificationManager.success('Updated Successfully', t)
            history.push('/tutor/availability')
          }
        }
      )
    } else {
      TutorApi.updateExceptionDates([], tutor_id).then(response => {
        if (response.status === 200) {
          NotificationManager.success('Updated Successfully', t)
          history.push('/tutor/availability')
        }
      })
    }
  }
  return (
    <React.Fragment>
      <div className='border-availabilities'>
        <div className='container-fluid ms-4'>
          <div className='row'>
            <div className='col ms-5'>
              <h1 className='title mt-5'>{t('tutor_availability_settings')}</h1>

              <div className='form-switch ps-0 pt-1'>
                <h2 className='date_override_title'>
                  {t('substitute_lesson_title')}
                </h2>
                <div className='sub_lessons_toggle'>
                  <input
                    className='form-check-input ms-0 me-3'
                    type='checkbox'
                    onClick={toggleSubBookings}
                    checked={subBookings}
                  />
                  <strong>{t('enable_substitute_bookings')}</strong>
                </div>
              </div>
            </div>
            <div className='col mb-5 me-5'>
              <div className='mt-5 me-5 sub_lessons_div'>
                <div className='p-4'>
                  <div>
                    <img src={subLessonIcon} alt='' />
                  </div>
                  <strong>{t('substitute_lesson_title')}</strong>
                  <p>{t('substitute_lesson_desc_one')}</p>
                  <p>{t('substitute_lesson_desc_two')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='border-availabilities'>
        <div className='container-fluid ms-4 mt-2 mb-5'>
          <div className='row pt-3'>
            <div className='col ms-5'>
              <div className='form-switch ps-0'>
                <h2 className='date_override_title'>
                  {t('substitute_us_holidays')}
                </h2>
                <div className='sub_lessons_toggle'>
                  <input
                    className='form-check-input ms-0 me-3'
                    type='checkbox'
                    onClick={toggleHolidayBookings}
                    checked={holidayBookings}
                  />
                  <strong>{t('enable_us_holidays_substitute')}</strong>
                </div>
              </div>
              <a className='btn mt-5' type='button' onClick={saveSettings}>
                <strong className='p3'>{t('save_return_settings')}</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* NOTE: TO BE ADDDED INTO V2
      <div className='border-availabilities'>
        <div className='container-fluid ms-4 mt-2 mb-5'>
          <div className='row'>
            <div className='col'>
              <div className='form-switch ps-0'>
                <h2 className='date_override_title'>{t('calendar_sync')}</h2>
                <p>{t('calendar_sync_info')}</p>
                <button
                  className='btn btn-lg-tutor google_sign_in mb-5'
                  type='button'
                >
                  <div>
                    <img className='me-2' src={googleIcon} alt='' />
                    <strong>{t('sign_in_google')}</strong>
                  </div>
                </button>
                <div className='sub_lessons_toggle mb-3'>
                  <input
                    className='form-check-input ms-0 me-3'
                    type='checkbox'
                    onClick={toggleCalendarConflicts}
                    checked={calendarConflicts}
                  />
                  <strong>{t('calendar_conflicts')}</strong>
                </div>
                <div className='sub_lessons_toggle'>
                  <input
                    className='form-check-input ms-0 me-3'
                    type='checkbox'
                    onClick={toggleAddCalendarLessons}
                    checked={addCalendarLessons}
                  />
                  <strong>{t('calendar_add_lessons')}</strong>
                </div>
              
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </React.Fragment>
  )
}
