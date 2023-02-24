import CustomTable from '../../components/CustomTable'

import CalendarIcon from '../../assets/images/calendar.svg'
import CheckIcon from '../../assets/images/check.svg'
import ManIcon from '../../assets/images/man.svg'
import Layout from '../../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import moment from 'moment-timezone'
import {
  approveAppointment,
  cancelAppointment,
  getAppointments
} from '../../actions/appointment'
import Loader from 'react-loader-spinner'
import { useTranslation } from 'react-i18next'
import { getTutorInfo } from '../../actions/tutor'
import { getUserInfo } from '../../actions/user'

const ApproveRequest = () => {
  const appointments = useSelector(state => state.appointment.list)
  const user = useSelector(state => state.users.user)
  const loading = useSelector(state => state.tutor.loading)
  const tutor = useSelector(state => state.tutor.info)
  const dispatch = useDispatch()
  const [t] = useTranslation('translation')
  const userTimezone = user?.time_zone?.split(' ')[0] || Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    dispatch(getUserInfo())
  }, [dispatch])

  useEffect(() => {
    if (user && user.tutor_profile) {
      dispatch(getTutorInfo(user.tutor_profile.id))
    }
  }, [user])

  useEffect(() => {
    if (tutor) {
      dispatch(getAppointments({ tutor_id: tutor.id }))
    }
  }, [tutor])

  const columns = [
    {
      title: t('student'),
      dataKey: 'studentName',
      width: 25
    },
    {
      title: t('lesson'),
      dataKey: 'lessonNumber',
      width: 25
    },
    {
      title: t('lesson_date'),
      dataKey: 'lessonDate',
      width: 25
    },
    {
      title: '',
      dataKey: 'actions',
      width: 25,
      render: (item, record) => (
        <div className='actions'>
          <a onClick={() => onClickApprove(record)} className='outlined'>
            {t('approve')}
          </a>
          <a onClick={() => onClickCancel(record)}>{t('cancel')}</a>
        </div>
      )
    }
  ]

  const onClickApprove = async ({ id }) => {
    await dispatch(approveAppointment(id))
    dispatch(getAppointments({ tutor_id: tutor.id }))
  }
  const onClickCancel = async ({ id }) => {
    await dispatch(cancelAppointment(id))
    dispatch(getAppointments({ tutor_id: tutor.id }))
  }

  const displayLessonRequestTable = () => {
    const data =
      (appointments &&
        appointments
          .filter(event => event.students.length > 0)
          .filter(event => !event.students[0].GroupStudent.approved)
          .map(event => ({
            id: event.id,
            img: event.students[0].user.avatar,
            studentName: `${event.students[0].user.first_name} ${event.students[0].user.last_name}`,
            lessonNumber: event.lesson.type,
            lessonDate: event.start_at
          }))) ||
      []
    return <CustomTable timezone={userTimezone} data={data} columns={columns} />
  }

  return (
    <Layout>
      <div className='main-dashboard p-5'>
        <h4 className='main-title'>{t('appointment_requests')}</h4>
        <div className='divider' />
        {displayLessonRequestTable()}
        {loading && (
          <Loader
            className='align-center'
            type='BallTriangle'
            color='#00BFFF'
            height={100}
            width={100}
          />
        )}
      </div>
    </Layout>
  )
}

export default ApproveRequest
