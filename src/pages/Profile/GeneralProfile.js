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

import './style/GeneralProfile.scss'

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

  const interests = ["Sports", "Movies", "Music", "Animals", "Food"]

  const details = [
    {
      id:1,
      caption: "Email",
      value: "addison@gmail.com",
    },
    {
      id:2,
      caption: "Korean Name",
      value: "알렉스",
    },
    {
      id:3,
      caption: "Gender",
      value: "Female",
    },
    {
      id:4,
      caption: "Pronouns",
      value: "She / Her",
    },
    {
      id:5,
      caption: "Birthday",
      value: "December 12, 2003",
    },
    {
      id:6,
      caption: "Parent Name",
      value: "Jessica Kim",
    },
    {
      id:7,
      caption: "Country",
      value: "Korea",
    },
  ]

  return (
    <div>
      <div className='main-dashboard scroll-layout'>
        <div className='flex-container'>
          <div className='flex-left children-wrapper flex-change '>
            <div className='profile_section'>
              <div className='profile_banner'>
                  <div className='profile_banner-top'>
                    <img src={profileAvatar} alt=''/>
                  </div>
                  <div className='profile_banner-bottom'>
                    <div className='profile_main-info'>
                      <div className='main_info-left'>
                        <h2>Addison</h2>
                        <p>
                          Level 3
                        </p>
                        <span>UTC +9 (Korean Standard Time)</span>
                      </div>
                      <div className='main_info-right'>
                        <button>Edit Profile</button>
                      </div>
                    </div>
                  </div>
              </div>

              <div className='edit_summary'>
                <header>
                  <h2>Summary</h2>
                  <button>Edit</button>
                </header>

                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pharetra eu leo a dignissim. Nunc et maximus urna. 
                </p>

                <p>
                Vestibulum sed leo ultrices, hendrerit tortor et, efficitur quam. Phasellus purus purus, sollicitudin et pulvinar vel, vehicula ac dolor 
                </p>
              </div>

              <div className='edit_interests'>
                <h2>My Interests</h2>
                <div className='row_interests'>
                  <div className='topics'>
                    {interests.map(item => 
                      <button key={item}>{item}</button>  
                    )}
                  </div>
                  <button>Edit Topics</button>
                </div>
              </div>

              <div className='enrolled_course'>
                <h2>Enrolled Courses</h2>
                {
                  Array.from({length:4}).map(item =>
                    <div className='enrolled_col'>
                      <div className='course_card'>
                        <h3>English</h3>
                        <button className='lesson_button'>
                          1-On-1 Lessons
                        </button>
                        <button className='time_button'>
                          30 Minutes
                        </button>
                        <button className='remaining_button'>
                          12 Lessons Remaining
                        </button>
                      </div>
                    </div>  
                  )
                }
              </div>
            </div>
          </div>
          <div className='student-list-appointments-wrapper flex-right changes-container'>
            <div className='favorite_section'>
              <h2>My Favorite Tutors</h2>
              
              <div className='favorite_col'>
                {
                  Array.from({length:3}).map(item => 
                    <div className='favorite_card'>
                      <div className='favorite_card-left'>
                        <h3>Sarah B.</h3>
                        <p>
                          Harvard University
                        </p>
                      </div>
                      <div className='favorite_card-right'>
                        <img src={tutorAvatar} alt=''/>
                      </div>
                    </div>  
                  )
                }
              </div>
            </div>

            <div className='details'>
              <h2>Additional Details</h2>

              <div className='details_col'>
                {
                  details.map(item => 
                    <div className='details_list' key={item.id}>
                      <h4>{item.caption}</h4>
                      <p>{item.value}</p>
                    </div>  
                  )
                }
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
