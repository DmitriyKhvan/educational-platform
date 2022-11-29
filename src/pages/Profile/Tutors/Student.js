import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { useDispatch, useSelector } from 'react-redux'
import Loader from 'react-loader-spinner'
import Lessons from '../../Tutors/Lessons'
import { getStudent } from '../../../actions/students'
import { Link, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Avatar } from '../../../components/Avatar'
import ImgCup from '../../../assets/images/cup.svg'
import { getAvatarName } from '../../../constants/global'
import { getUserInfo } from '../../../actions/user'
import { getTutorInfo } from '../../../actions/tutor'
import { getAppointments } from '../../../actions/appointment'
import { confirmationReferal } from '../../../actions/admin'

const StudentProfile = props => {
  const [t, i18n] = useTranslation('translation')
  console.log(props)
  const student_id = props.selectedUser.id;
  const user = useSelector(state => state.users.user)
  const student = useSelector(state => state.students.student_info)
  const tutor = useSelector(state => state.tutor.info)
  const appointments = useSelector(state => state.appointment)
  const dispatch = useDispatch()

  const confirmReferal = (e, referalUser) => {
    if(e && referalUser) {
      dispatch(confirmationReferal(referalUser?.id))
    }
  }

  useEffect(() => {
    if (!user) {
      dispatch(getUserInfo())
    }
  }, [dispatch])

  useEffect(() => {
    if (user && user.tutor_profile) {
      dispatch(getStudent(student_id))
      dispatch(getTutorInfo(user.tutor_profile.id))
    }
  }, [user])

  useEffect(() => {
    if (tutor && student) {
      dispatch(getAppointments({ tutor_id: tutor.id, student_id: student_id }))
    }
  }, [tutor, student])

  return (
      <div className='student-list'>
        {/* <div className='page-header'>
          <h4 className='main-title'>{t('student_profile')}</h4>
        </div> */}
        <div className='divider' />
        <div className='scroll-layout'>
          {!props.user ? (
            <Loader
              className='align-center'
              type='Audio'
              color='#00BFFF'
              height={50}
              width={50}
            />
          ) : (
            <>
              <div className='tutor-student-profile'>
                <div className='avatar'>
                  <Avatar
                    avatar={props.user.avatar}
                    name={getAvatarName(
                      props.user.first_name,
                      props.user.last_name
                    )}
                  />
                </div>
                <div className='info'>
                  <div>
                    <p className='name'>{`${props.user.first_name} ${props.user.last_name}`}</p>
                    <p className='level'>{t('intermediate_level')}</p>
                    <p className='since'>Since July 2018</p>
                    <div>
                      <div className='contact'>
                        <p className='other'>{props.user.phone_number}</p>
                        <p className='other'>{props.user.email}</p>
                      </div>
                      <div className='address'>
                        <p className='other'>154 W Market St,</p>
                        <p className='other'>Long Beach, NY, 11561</p>
                      </div>
                    </div>
                  </div>
                  <div className='actions_info'>
                    <div>
                      <Link
                        to={{
                          pathname: '/messages',
                          state: { user_id: student_id }
                        }}
                      >
                        {t('send_message')}
                      </Link>
                    </div>
                    {props.user?.referal_id && (
                      <div className='referal_box'>
                        <label>
                          Confirm referal 
                          <input onChange={e => confirmReferal(e.target.checked, props.user)} type={"checkbox"}/>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className='lessons_table'>
                <div className='m-t-48'>
                  <Lessons
                    appointments={appointments}
                    title={t('upcoming_lessons')}
                    status='upcoming'
                  />
                </div>
                <div className='m-t-48'>
                  <Lessons
                    appointments={appointments}
                    title={t('past_lessons')}
                    status='past'
                  />
                </div>
              </div>

              <div className='lessons_table'>
                <p className='section-title'>{t('level_certificate')}</p>
                <div className='achivement-wrapper'>
                  <div className='achivements'>
                    <img src={ImgCup} alt='' />
                    <img src={ImgCup} alt='' />
                    <img src={ImgCup} alt='' />
                  </div>
                </div>
              </div>
              {appointments && appointments.loading && (
                <Loader
                  className='align-center'
                  type='Audio'
                  color='#00BFFF'
                  height={50}
                  width={50}
                />
              )}
            </>
          )}
        </div>
      </div>
  )
}

export default StudentProfile
