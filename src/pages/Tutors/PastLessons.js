import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import Layout from '../../components/Layout'
import CustomTable from '../../components/CustomTable'
import { useDispatch, useSelector } from 'react-redux'
import { getAppointments } from '../../actions/appointment'
import Loader from 'react-loader-spinner'
import Lessons from './Lessons'
import ModalLesson from './ModalLesson'
import { useTranslation } from 'react-i18next'
import { getUserInfo } from '../../actions/user'
import { getTutorInfo } from '../../actions/tutor'

const PastLessons = () => {
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
  const appointments = useSelector(state => state.appointment)
  const [t, i18n] = useTranslation('translation')
  const dispatch = useDispatch()

  useEffect(() => {
    if (!user) {
      dispatch(getUserInfo())
    }
  }, [dispatch])

  useEffect(() => {
    if (user && user.tutor_profile && !tutor) {
      dispatch(getTutorInfo(user.tutor_profile.id))
    }
  }, [user])

  useEffect(() => {
    if (tutor) {
      dispatch(getAppointments({ tutor_id: tutor.id }))
    }
  }, [tutor])

  const onSelectStudent = student => {}

  return (
    <Layout>
      <div className='student-list'>
        <Lessons
          appointments={appointments}
          title={t('past_lessons')}
          status='past'
          onAction={onSelectStudent}
        />
        {appointments && appointments.loading && (
          <Loader
            className='align-center'
            type='Audio'
            color='#00BFFF'
            height={50}
            width={50}
          />
        )}
      </div>
    </Layout>
  )
}

export default PastLessons
