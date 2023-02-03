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
  Link,
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
import React from 'react';
import EditProflileModal from '../../components/EditProflileModal';
import { useAuth } from '../../modules/auth';

const options = [
  { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
  { value: 'completed_lesson', label: 'Completed Lessons' }
]

const interests = [
  {
    id:1,
    title:"Sports",
    isTopic: true
  },
  {
    id:2,
    title: "Movies",
    isTopic: true
  },
  {
    id:3,
    title: "Music",
    isTopic: true
  },
  {
    id:4,
    title: "Animals",
    isTopic: true
  },
  {
    id:5,
    title: "Food",
    isTopic: true
  },
]


const GeneralProfile = ({currentUser, isAdmin=false}) => {

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


  // const onCancel = async ({ id, reasons }) => {
  //   setIsLoading(true)
  //   try {
  //     await AppointmentApi.cancelAppointment(id)
  //     await fetchAppointments()
  //   } catch (e) {
  //     NotificationManager.error(e.response?.data?.message || 'Server Issue', t)
  //   }
  //   setSelectedLesson(false)
  //   setIsLoading(false)
  // }

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
        // await fetchAppointments()
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

  // const fetchAppointments = async () => {
  //   let queryObj = {}

  //   if (user.student_profile) {
  //     queryObj.student_id = user.student_profile.id
  //   } else {
  //     return
  //   }

  //   if (selectedOption === options[1]) {
  //     queryObj.completed = true
  //   }

  //   await dispatch(getAppointments(queryObj))
  //   setIsLoading(false)
  // }

  

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
              // fetchAppointments={fetchAppointments}
            />
          </div>
        )
      )
    })


  const [showEditModal , setIsShowEditModal] = React.useState(false)

  const actions = useAuth();

  const avatar = actions.user?.student?.avatar?.url;

  return (
    <div>
      <div className='main-dashboard scroll-layout'>
        <div className='flex-container'>
          <div className='flex-left children-wrapper flex-change '>
            <div className='profile_section'>
              <div className='profile_banner'>
                  <div className='profile_banner-top'>
                    {
                      avatar 
                        ? <img style={{objectPosition: "top"}} src={avatar} alt=''/>
                        : <img src={profileAvatar} alt=''/>
                    }
                    
                  </div>
                  <div className='profile_banner-bottom'>
                    <div className='profile_main-info'>
                      <div className='main_info-left'>
                        <h2>
                          {actions.user?.firstName + " "}
                          { actions.user?.lastName}
                        </h2>
                        <p>
                          Level 3
                        </p>
                        <span>
                          {
                            actions.user?.timeZone
                              ? actions.user?.timeZone
                              : "PST (GMT-8)" 
                          }
                        </span>
                      </div>
                      <div className='main_info-right'>
                        <button onClick={() => setIsShowEditModal(true)}>Edit Profile</button>
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
                      <button key={item.id}>{item.title}</button>  
                    )}
                  </div>
                  <Link to={"/student/profiles/edit-topics"}>Edit Topics</Link>
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

                <div className='details_list'>
                  <h4>Email</h4>
                  <p>{actions.user?.email}</p>
                </div> 

                <div className='details_list'>
                  <h4>Korean Name</h4>
                  <p>{
                    actions.user?.koreanEquivalent 
                      ? actions.user?.koreanEquivalent
                      : "알렉스"
                  }</p>
                </div> 

                <div className='details_list'>
                  <h4>Gender</h4>
                  <p>{
                    actions.user?.gender 
                      ? actions.user?.gender
                      : "Male"
                  }</p>
                </div> 
               
                <div className='details_list'>
                  <h4>Country</h4>
                  <p>{
                    actions.user?.country 
                      ? actions.user?.country
                      : "Korea"
                  }</p>
                </div> 

                <div className='details_list'>
                  <h4>Address</h4>
                  <p>{
                    actions.user?.address 
                      ? actions.user?.address
                      : "123 Street, City, State"
                  }</p>
                </div> 

                <div className='details_list'>
                  <h4>Phone Number</h4>
                  <p>{
                    actions.user?.phoneNumber 
                      ? actions.user?.phoneNumber
                      : "+996553720025"
                  }</p>
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
          // onCancel={onCancel}
          reasons={cancel_lesson_reasons_student}
        />
      )}

      {<EditProflileModal isOpen={showEditModal} setIsOpen={setIsShowEditModal} />}

      {/* {isLoading && <Loader />} */}
    </div>
  )
}
export default GeneralProfile;
