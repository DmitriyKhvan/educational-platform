import '../../assets/styles/student.scss';

import {
  useEffect,
  useState,
} from 'react';

import moment from 'moment-timezone';
import { useTranslation } from 'react-i18next';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  useHistory,
  useParams,
} from 'react-router-dom';

import { getAppointments } from '../../actions/appointment';
import AppointmentApi from '../../api/AppointmentApi';
import profileAvatar from '../../assets/images/Avatar.png';
import tutorAvatar from '../../assets/images/tutor.png';
import whiteBookingIcon from '../../assets/images/white_book_trial_icon.svg';
import whiteSubscriptionIcon
  from '../../assets/images/white_subscription_icon.svg';
import Loader from '../../components/common/Loader';
import { ModalCancelLesson } from '../../components/ModalCancelLesson';
import NotificationManager from '../../components/NotificationManager.js';
import ScheduleCard from '../../components/student-dashboard/ScheduleCard';
import { cancel_lesson_reasons_student } from '../../constants/global';

const options = [
  { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
  { value: 'completed_lesson', label: 'Completed Lessons' }
]

const GeneralProfile = () => {
  const { complete_appoint_id } = useParams()
  const dispatch = useDispatch()
  const [t] = useTranslation('translation')
  const [selectedOption, setSelectedOption] = useState(options[0])
  const [selectedLesson, setSelectedLesson] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const appointments = useSelector(state => state.appointment.list)
  const user = useSelector(state => state.users.user)
  const [completedAppointment, setCompleteAppointment] = useState(null)
  const history = useHistory()
  const onDismiss = () => setCompleteAppointment(null)
  const onCancel = async ({ id, reasons }) => {
    setIsLoading(true)
    try {
      await AppointmentApi.cancelAppointment(id)
      await fetchAppointments()
    } catch (e) {
      NotificationManager.error(e.response?.data?.message || 'Server Issue', t)
    }
    setSelectedLesson(false)
    setIsLoading(false)
  }

  const callToAction = [
    {
      icon: whiteBookingIcon,
      title: t('book_trial'),
      subtitle: t('book_trial_subtitle'),
      color: 'light-blue'
    },
    {
      icon: whiteSubscriptionIcon,
      title: t('purchase_subscription'),
      subtitle: t('purchase_subscription_subtitle'),
      color: 'pink'
    }
  ]

  useEffect(() => {
    ;(async () => {
      if (user.tutor_profile) {
        history.push('/')
      }
      if (user) {
        await fetchAppointments()
      }
    })()
  }, [selectedOption, user])

  useEffect(() => {
    if (complete_appoint_id) {
      const feedbackAppt = appointments.find(
        apt => apt.id == complete_appoint_id
      )
      setCompleteAppointment(feedbackAppt)
    }
  }, [appointments, complete_appoint_id])

  const fetchAppointments = async () => {
    let queryObj = {}

    if (user.student_profile) {
      queryObj.student_id = user.student_profile.id
    } else {
      return
    }

    if (selectedOption === options[1]) {
      queryObj.completed = true
    }

    await dispatch(getAppointments(queryObj))
    setIsLoading(false)
  }

  const isWithinAweekArr = appointments
    .map(x => {
      const startOfWeek = moment().isAfter(moment().startOf('isoWeek'))
        ? moment().startOf('day')
        : moment().startOf('isoWeek')
      if (
        moment(x.start_at).isBetween(startOfWeek, moment().endOf('isoWeek'))
      ) {
        return x
      }
    })
    .filter(x => x)

    const isWithinAweek = isWithinAweekArr.filter(
    (x, i, a) => a.findIndex(y => y.start_at === x.start_at) === i
  )

  const ScheduleArr = isWithinAweek
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
    .map((x, i) => {
      const date = moment(x.start_at)
      const expiredDate = moment(x.start_at).add(x.duration, 'minutes')
      const currentDate = moment()
      return (
        currentDate.isBefore(expiredDate) && (
          <div>
            <ScheduleCard
              lesson={x.lesson.description}
              zoomlink={x.zoomlink}
              date={date}
              data={x}
              key={i}
              index={i}
              fetchAppointments={fetchAppointments}
            />
          </div>
        )
      )
    })

  return (
    <div>
      <div className='main-dashboard scroll-layout'>
        <div className='flex-container'>
          <div className='student-dashboard flex-left children-wrapper flex-change childern-padding'>

          </div>
          <div className='student-list-appointments-wrapper flex-right changes-container'>
            <div>
              <h3 className='right-bar-title'>My Favorite Tutors</h3>
              <div className='tutors-block'>
                <div className='tutor-item'>
                  <div>
                  <h4 className='name'>Sarah B.</h4>
                  <span className='university'>Harvard University</span>
                  </div>
                  <img className='avatar' src={tutorAvatar}/>
                </div>

                <div className='tutor-item'>
                  <div>
                  <h4 className='name'>Sarah B.</h4>
                  <span className='university'>Harvard University</span>
                  </div>
                  <img className='avatar' src={tutorAvatar}/>
                </div>

                <div className='tutor-item'>
                  <div>
                  <h4 className='name'>Sarah B.</h4>
                  <span className='university'>Harvard University</span>
                  </div>
                  <img className='avatar' src={tutorAvatar}/>
                </div>
              </div>
            </div>
   
          </div>
        </div>
      </div>
      {selectedLesson && (
        <ModalCancelLesson
          visible={!!selectedLesson}
          lesson={selectedLesson}
          onDismiss={onDismiss}
          onCancel={onCancel}
          reasons={cancel_lesson_reasons_student}
        />
      )}

      {isLoading && <Loader />}
    </div>
  )
}
export default GeneralProfile
