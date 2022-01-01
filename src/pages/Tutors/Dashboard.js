import SummaryCard from '../../components/SummaryCard'

import CalendarIcon from '../../assets/images/calendar.svg'
import CheckIcon from '../../assets/images/check.svg'
import ManIcon from '../../assets/images/man.svg'
import { useTranslation } from 'react-i18next'
import Lessons from './Lessons'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getAppointments } from '../../actions/appointment'
import Loader from 'react-loader-spinner'
import { getUserInfo } from '../../actions/user'
import { getTutorInfo } from '../../actions/tutor'
import ModalLesson from './ModalLesson'
import LessonFinishModal from './LessonFinishModal'
import ModalFeedback from './ModalFeedback'

const TutorDashboard = () => {
  const user = useSelector(state => state.users.user)
  const tutor = useSelector(state => state.tutor.info)
  const appointments = useSelector(state => state.appointment)
  const [t, i18n] = useTranslation('translation')
  const [upcomingLessons, setUpcomingLessons] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(0)
  const [studentManaged, setStudentManaged] = useState(0)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState(null)

  const [selectedGroupForReview, setSelectedGroupForReview] = useState(null)
  const [selectedGroupForFeedback, setSelectedGroupForFeedback] = useState(null)

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

  const fetchAppointments = () => {
    if (tutor) {
      dispatch(getAppointments({ tutor_id: tutor.id }))
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [tutor])

  useEffect(() => {
    if (appointments && appointments.list.length > 0) {
      const today = new Date()
      const ids = []
      for (let apt of appointments.list) {
        if (ids.indexOf(apt.students[0].id) === -1) ids.push(apt.students[0].id)
      }
      setUpcomingLessons(
        appointments.list.filter(apt => today < new Date(apt.start_at)).length
      )
      setCompletedLessons(appointments.list.filter(apt => apt.completed).length)
      setStudentManaged(ids.length)
    }
  }, [appointments])

  const onSelectStudent = (student, status) => {
    setSelectedStudent(student)
    setStatus(status)
    setVisible(true)
  }

  const onDismiss = () => {
    setVisible(false)
    setSelectedStudent(null)
  }

  const onCompleteLesson = group => {
    setSelectedGroupForReview(group)
  }

  const onFeedback = group => {
    setSelectedGroupForFeedback(group)
  }

  return (
    <div className='main-dashboard'>
      <h4 className='main-title'>{t('main_dashboard')}</h4>
      <div className='divider' />
      <div className='summary-information'>
        <SummaryCard
          text={t('upcoming_appointments')}
          icon={CalendarIcon}
          number={upcomingLessons}
        />
        <SummaryCard
          text={t('completed_lessons')}
          icon={CheckIcon}
          number={completedLessons}
        />
        <SummaryCard
          text={t('students_managed')}
          icon={ManIcon}
          number={studentManaged}
        />
      </div>
      <Lessons
        appointments={appointments}
        title={t('upcoming_lessons')}
        status='upcoming'
        onAction={onSelectStudent}
      />
      <Lessons
        appointments={appointments}
        title={t('past_lessons')}
        status='past'
        onAction={onSelectStudent}
        onComplete={onCompleteLesson}
        onFeedback={onFeedback}
      />
      {visible && (
        <ModalLesson
          title='Student Lesson History'
          visible={visible}
          student={selectedStudent}
          onDismiss={onDismiss}
          status={status}
        />
      )}

      <LessonFinishModal
        group={selectedGroupForReview}
        visible={!!selectedGroupForReview}
        onDismiss={() => {
          fetchAppointments()
          setSelectedGroupForReview(null)
        }}
        user={user}
      />

      <ModalFeedback
        group={selectedGroupForFeedback}
        visible={!!selectedGroupForFeedback}
        onDismiss={() => {
          fetchAppointments()
          setSelectedGroupForFeedback(null)
        }}
        user={user}
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
  )
}

export default TutorDashboard
