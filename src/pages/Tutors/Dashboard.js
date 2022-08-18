import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import ImgCalendar from '../../assets/images/calendar_icon.svg'
import { getAppointments } from '../../actions/appointment'
import ScheduleCard from '../../components/student-dashboard/ScheduleCard'
import { getUserInfo } from '../../actions/user'
import { getTutorInfo } from '../../actions/tutor'
import BookingRequest from '../../components/BookingRequest'
import Loader from '../../components/common/Loader'

const TutorDashboard = () => {
  const [t] = useTranslation('translation')
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(true)
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
  const appointments = useSelector(state => state.appointment)
  const [upcomingLessons, setUpcomingLessons] = useState([])
  const [lessonApprovals, setLessonApprovals] = useState([])
  const hasLessonApprovals = lessonApprovals.length > 0
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

  const fetchAppointments = async () => {
    if (tutor) {
      setIsLoading(true)
      await dispatch(getAppointments({ tutor_id: tutor.id }))
      setIsLoading(false)
    }
  }

  useEffect(() => {
    ;(async () => {
      await fetchAppointments()
    })()
  }, [tutor])

  useEffect(() => {
    if (appointments && appointments.list.length > 0) {
      const startOfDay = new moment().startOf('day')
      const endOfDay = new moment().endOf('day')
      const ids = []
      for (const apt of appointments.list) {
        if (ids.indexOf(apt.students[0].id) === -1) ids.push(apt.students[0].id)
      }
      setUpcomingLessons(
        appointments.list.filter(
          apt =>
            new moment(apt.start_at).isBefore(endOfDay) &&
            new moment(apt.start_at).isAfter(startOfDay)
        )
      )
      setLessonApprovals(
        appointments.list
          .filter(apt => apt.students.length > 0)
          .filter(apt => !apt.students[0].GroupStudent.approved)
          .filter(apt => new moment(apt.start_at).isAfter(new moment()))
      )
    }
  }, [appointments])

  return (
    <div className='main-dashboard scroll-layout'>
      <div className='flex-container'>
        <div className='student-dashboard flex-left children-wrapper flex-change '>
          <div className='set-container'>
            <h4 className='welcome-message'>
              {t('student_dashboard_welcome', { name: user.first_name })}
            </h4>
            <p className='welcome-subtitle'>{t('tutor_welcome_back')}</p>

            <div className='schedule-lesson-select pt-3'>
              <div className='page-card purple large-card py-5 pb-4 purple-top-align'>
                <div className='row'>
                  <div className='col-2 ms-3 mobilefinal mobilefinal-image'>
                    <img
                      className='img-fluid large-card-icon sizes'
                      alt=''
                      src={ImgCalendar}
                    />
                  </div>
                  <div className='col-7'>
                    <div className='titles_align_desktop'>
                      <p className='titles mt-1  laptop-title mobile_align_dash'>
                        {t('review_my_schedule')}
                      </p>
                    </div>

                    <div className='row mobile-view-buttons '>
                      <div className='col-6 desktop schedule-dashboard-button'>
                        <Link
                          to='/tutor/appointments-calendar'
                          className='enter-btn dashboard_cal-scl_button'
                        >
                          {t('calendar')}
                        </Link>
                      </div>
                      <div className='col-6 schedule-dashboard-button'>
                        <Link
                          to='/tutor/availability'
                          className='enter-btn dashboard_cal-scl_button'
                        >
                          {t('availability')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='student-list-appointments-wrapper flex-right children-wrapper changes-container'>
          <div className='child-set_container'>
            {hasLessonApprovals && (
              <BookingRequest
                lessonApprovals={lessonApprovals}
                fetchAppointments={fetchAppointments}
              />
            )}
            <h4 className='weekly-schedule'>{t('daily_schedule')}</h4>
            <h4 className='text-purple weekly-schedule-subtitle'>
              {t('tutor_dashboard_total_lessons')}
            </h4>
            {t('tutor_dashboard_total_lessons', {
              total_lessons: upcomingLessons.length,
              t: upcomingLessons.length > 1 ? 's' : ''
            })}
            <Link
              to='/tutor/appointments-calendar'
              className='enter-btn ms-0 tutor_cal_appoint'
            >
              {t('student_dashboard_view_all_lessons')}
            </Link>
            <div className='weekly-schedule-scroll'>
              {upcomingLessons &&
                upcomingLessons.map((x, i) => {
                  const date = moment(x.start_at).unix()
                  return (
                    <ScheduleCard
                      lesson={x.lesson.description}
                      zoomlink={x.zoomlink}
                      date={date}
                      data={x}
                      key={i}
                      fetchAppointments={fetchAppointments}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </div>
  )
}

export default TutorDashboard
