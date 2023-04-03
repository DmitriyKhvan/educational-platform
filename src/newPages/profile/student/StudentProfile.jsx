import React from 'react';


import '../../../assets/styles/student.scss';
import "./style/StudentProfile.scss";

import profileAvatar from '../../../assets/images/Avatar.png';

import './style/GeneralProfile.scss'
import { useAuth } from '../../../modules/auth';
import EditProflileModal from './EditProflileModal';
import { useMutation, useQuery } from '@apollo/client';
import { GROUPS_QUERY, MUTATION_UPDATE_STUDENT } from '../../../modules/auth/graphql';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import femaleAvatar from '../../../assets/images/avatars/img_avatar_female.png'
import maleAvatar from '../../../assets/images/avatars/img_avatar_male.png'
import { getPlanStatus } from '../../../actions/subscription';
import { useHistory } from 'react-router-dom';
// const options = [
//   { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
//   { value: 'completed_lesson', label: 'Completed Lessons' }
// ]

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


const StudentProfile = () => {
  const { data: groups, userLoading, refetch: refetchUser } = useQuery(GROUPS_QUERY);

  // const [selectedOption, setSelectedOption] = useState(options[0])
  // const [selectedLesson, setSelectedLesson] = useState(false)
  // const [isLoading, setIsLoading] = useState(true)
  // const [completedAppointment, setCompleteAppointment] = useState(null)
  // const onDismiss = () => setCompleteAppointment(null)


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

  // const callToAction = [
  //   {
  //     icon: whiteBookingIcon,
  //     title: t('book_trial'),
  //     subtitle: t('book_trial_subtitle'),
  //     color: 'light-blue'
  //   },
  //   {
  //     icon: whiteSubscriptionIcon,
  //     title: t('purchase_subscription'),
  //     subtitle: t('purchase_subscription_subtitle'),
  //     color: 'pink'
  //   }
  // ]


  // useEffect(() => {
  //   ;(async () => {
  //     if (user.tutor_profile) {
  //       history.push('/')
  //     }
  //     if (user) {
  //       // await fetchAppointments()
  //     }
  //   })()
  // }, [selectedOption, user])

  // useEffect(() => {
  //   if (complete_appoint_id) {
  //     const feedbackAppt = appointments.find(
  //       apt => apt.id == complete_appoint_id
  //     )
  //     setCompleteAppointment(feedbackAppt)
  //   }
  // }, [appointments, complete_appoint_id])

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

  

  // const isWithinAweekArr = appointments
  //   .map(x => {
  //     const startOfWeek = moment().isAfter(moment().startOf('isoWeek'))
  //       ? moment().startOf('day')
  //       : moment().startOf('isoWeek')
  //     if (
  //       moment(x.start_at).isBetween(startOfWeek, moment().endOf('isoWeek'))
  //     ) {
  //       return x
  //     }
  //   })
  //   .filter(x => x)

  //   const isWithinAweek = isWithinAweekArr.filter(
  //   (x, i, a) => a.findIndex(y => y.start_at === x.start_at) === i
  // )

  // const ScheduleArr = isWithinAweek
  //   .sort((a, b) => new Date(a.start_at) - new Date(b.start_at))
  //   .map((x, i) => {
  //     const date = moment(x.start_at)
  //     const expiredDate = moment(x.start_at).add(x.duration, 'minutes')
  //     const currentDate = moment()
  //     return (
  //       currentDate.isBefore(expiredDate) && (
  //         <div>
  //           <ScheduleCard
  //             lesson={x.lesson.description}
  //             zoomlink={x.zoomlink}
  //             date={date}
  //             data={x}
  //             key={i}
  //             index={i}
  //             // fetchAppointments={fetchAppointments}
  //           />
  //         </div>
  //       )
  //     )
  //   })

  const [updateStudent] = useMutation(
    MUTATION_UPDATE_STUDENT
  )

  const [showEditModal , setIsShowEditModal] = React.useState(false)
  const [summary, setSummary] = React.useState(false)
  const [about , setAbout] = React.useState("");
  const [save, setSave] = React.useState(false)
  const notify = () => toast("Summary information is changed!")
  const planStatus = useSelector(state => state.students.planStatus)
  const [profileImage, setProfileImage] = React.useState('')
  const dispatch = useDispatch()
  const [schedule, setSchedule] = React.useState()
  const navigate = useHistory();

  const actions = useAuth();
  const avatar = actions?.user?.student?.avatar?.url;


  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar)
    } else if (actions.user?.gender === 'female') {
      setProfileImage(femaleAvatar)
    } else if (actions.user?.gender === 'male') {
      setProfileImage(maleAvatar)
    } else {
      setProfileImage(maleAvatar)
    }
  }, [actions, avatar])

  const saveSummary = async () => {

   if(about !== "") {
    const { data } = await updateStudent({
      variables: {
        data: {
          about: about
        },
        where: {
          id: parseInt(actions?.user?.student?.id)
        }
      }
    })

    if(data) {
      setSave(false)
      setSummary(false)
      setAbout("")
      notify()
    }

    await actions.refetchUser();
   }
  }

  const cancelSummary = () => {
    setSummary(false)
    setSave(false)
    setAbout("")
  }

  const editSummary = () => {
    setSummary(true)
    setSave(true)
  }

  React.useEffect(() => {
    dispatch(getPlanStatus())
  }, [dispatch, schedule])

  const defaultAbout = actions?.user?.student?.about;

  console.log(planStatus)

  return (
    <div>
      <div className='main-dashboard scroll-layout'>
        <div className='flex-container'>
          <div className='flex-left children-wrapper flex-change '>
            <div className='profile_section'>
              <div className='profile_banner'>
                  <div className='profile_banner-top'>
                     <img style={{objectPosition: "top"}} src={profileImage} alt=''/>
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
                        <button onClick={() => {
                          navigate.push("/student/profiles/edit-information");
                        }}>Edit Profile</button>
                      </div>
                    </div>
                  </div>
              </div>
              
              <div className='edit_summary'>
                <header>
                  <h2>Summary</h2>
                  {
                    save 
                      ? <div>
                        <button onClick={saveSummary}>Save</button>
                        <button onClick={cancelSummary}>Cancel</button>
                      </div>
                      : <button onClick={editSummary }>Edit</button>
                  }
                </header>

                {
                  summary 
                    ? <textarea 
                        onChange={e => setAbout(e.target.value)} 
                        className='edit_summary_textarea' 
                        defaultValue={!defaultAbout ? about : defaultAbout}
                      >

                      </textarea>
                    : !defaultAbout 
                      ? <React.Fragment>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas pharetra eu leo a dignissim. Nunc et maximus urna. 
                          </p>

                          <p>
                              Vestibulum sed leo ultrices, hendrerit tortor et, efficitur quam. Phasellus purus purus, sollicitudin et pulvinar vel, vehicula ac dolor 
                          </p>
                        </React.Fragment>
                      : <p>
                        {defaultAbout}
                      </p>
                }

              </div>
{/* 
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
              </div> */}
              <div className='enrolled_course'>
                <h2>Enrolled Courses</h2>
                {planStatus && 
                  planStatus.map(item =>
                    <div key={item.id} className='enrolled_col'>
                      <div className='course_card'>
                        <h3>
                          {item.lesson_type}
                        </h3>
                        <button className='lesson_button'>
                          1-On-1 Lessons
                        </button>
                        <button className='time_button'>
                          {item.duration} Minutes
                        </button>
                        <button className='remaining_button'>
                          {item.total_lessons} Lessons Remaining
                        </button>
                      </div>
                    </div>  
                  )
                }

                {planStatus?.length === 0 && <p>You don't have any courses!</p>}
              </div>
            </div>
          </div>
          <div className='student-list-appointments-wrapper flex-right changes-container'>
            {/* <div className='favorite_section'>
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
            </div> */}

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
      {/* {selectedLesson && (
        <ModalCancelLesson
          visible={!!selectedLesson}
          lesson={selectedLesson}
          onDismiss={onDismiss}
          // onCancel={onCancel}
          reasons={cancel_lesson_reasons_student}
        />
      )} */}

      {
        <EditProflileModal 
          profileImage={profileImage} 
          isOpen={showEditModal} 
          setIsOpen={setIsShowEditModal}
        />
      }

      {/* {isLoading && <Loader />} */}
    </div>
  )
}
export default StudentProfile;
