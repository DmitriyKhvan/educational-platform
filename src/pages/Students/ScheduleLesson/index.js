import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Layout from '../../../components/Layout'
import '../../../assets/styles/tutor.scss'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import NotificationManager from '../../../components/NotificationManager.js'
import { createAppointment } from '../../../actions/appointment'
import { useTranslation } from 'react-i18next'
import ImgClock from '../../../assets/images/clock.svg'
import ImgTutor from '../../../assets/images/tutor.svg'
import { Link } from 'react-router-dom'
import { getPlanStatus } from '../../../actions/subscription'

const ScheduleLesson = () => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')

  const planStatus = useSelector(state => state.students.planStatus)
  const loading = useSelector(state => state.students.loading)

  useEffect(() => {
    dispatch(getPlanStatus())
  }, [dispatch])

  return (
    <Layout>
      <div className="schedule-lesson-layout">
        <h4 className="main-title">{t('schedule_lesson')}</h4>
        <div className="divider" />
        <div className="scroll-layout">
          <div className="select-first-criteria">
            <div className="or">{t('or')}</div>
            <div className="criteria-select-box">
              <div className="img">
                <img src={ImgClock} alt="" />
              </div>
              <Link
                className="btn"
                to={{
                  pathname: '/student/schedule-lesson',
                  state: { timeFirst: true }
                }}
              >
                {t('select_time_first')}
              </Link>
            </div>
            <div className="criteria-select-box">
              <div className="img">
                <img src={ImgTutor} alt="" />
              </div>
              <Link
                className="btn"
                to={{
                  pathname: '/student/schedule-lesson',
                  state: { tutorFirst: true }
                }}
              >
                {t('select_tutor_first')}
              </Link>
            </div>
          </div>
          <p className="sub-title">{t('lessons_left')}</p>
          {loading ? (
            <Loader
              className="align-center"
              type="Audio"
              color="#00BFFF"
              height={50}
              width={50}
            />
          ) : planStatus.length === 0 ? (
            <span className="no-data">{t('you_have_no_subscription')}</span>
          ) : (
            <>
              <div className="lesson-brief-wraper">
                <p>{t('lesson_summary')}</p>
                <div>
                  {planStatus.map((lesson, index) => (
                    <div key={`lesson-${index}`} className="lesson">
                      <div>
                        <p className="class">{lesson.lesson_type}</p>
                        <p className="type">({lesson.group_type})</p>
                      </div>
                      <div className="duration-box">
                        <span className={`duration d-${lesson.duration}m`}>
                          {lesson.duration}m
                        </span>
                        <span className={`remains d-${lesson.duration}m`}>
                          {lesson.total_lessons - lesson.lessons}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
          <Link to="/student/packages" className="btn">
            + {t('buy_another_plan')}
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default ScheduleLesson
