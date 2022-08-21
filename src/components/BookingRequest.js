import React from 'react'
import moment from 'moment'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { approveAppointment, cancelAppointment } from '../actions/appointment'

const BookingRequest = ({ lessonApprovals, fetchAppointments }) => {
  const [t] = useTranslation()
  const dispatch = useDispatch()

  const onClickApproval = async ({ target }) => {
    await dispatch(approveAppointment(target.id))
    fetchAppointments()
  }

  const onClickDecline = async ({ target }) => {
    await dispatch(cancelAppointment(target.id))
    fetchAppointments()
  }

  return (
    <React.Fragment>
      <h4 className='weekly-schedule'>{t('booking_request')}</h4>
      {lessonApprovals.map(apt => {
        const date = moment(apt.start_at).utc(0, true)
        return (
          <div className='page-card grey-border bg-white small-card mt-4 p-3 pt-0 ps-4'>
            <h1 className='text-black'>{apt.lesson.description}</h1>
            <p className='text-light-grey mt-0'>
              {date.format('MMMM DD, YYYY')} at {date.format('hh:mm a')} →{' '}
              {date.add(apt.duration, 'minutes').format('hh:mm a')}
            </p>
            <div className='row ps-3'>
              <div
                className='col-auto bg-grey-100'
                style={{ borderRadius: '4px' }}
              >
                <p className='m-1 mx-2 text-grey-700'>
                  {t('student_level', {
                    t: apt.students[0].level || 0
                  })}
                </p>
              </div>
              <div
                className='col-auto ms-2 bg-light-purple'
                style={{ borderRadius: '4px' }}
              >
                <p className='m-1 mx-2 text-primary'>
                  {apt.type === '1-on-1' ? t('private') : t('group')}
                </p>
              </div>
              <div
                className='col-auto ms-2 bg-light-purple'
                style={{ borderRadius: '4px' }}
              >
                <p className='m-1 mx-2 text-primary'>{apt.duration + 'm'}</p>
              </div>
            </div>
            <div className='row pt-3'>
              <div className='col-6'>
                <button
                  className='enter-btn grey-border w-85'
                  onClick={onClickApproval}
                  id={apt.id}
                >
                  {t('accept')}
                </button>
              </div>
              <div className='col-6'>
                <button
                  className='enter-btn grey-border w-85 ms-0'
                  onClick={onClickDecline}
                  id={apt.id}
                >
                  {t('decline')}
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}

export default BookingRequest
