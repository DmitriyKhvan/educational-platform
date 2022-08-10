import { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import NotificationManager from '../../../components/NotificationManager'
import { updateStudent, getStudent } from '../../../actions/students'
import Layout from '../../../components/Layout'
import { getPlan, createPlan, updatePlan } from '../../../actions/subscription'
import {
  languageLevels,
  courses,
  course_options,
  subscriptions,
  filterLessonsByStatus,
  getAvatarName,
  getAbbrName
} from '../../../constants/global'
import { renderFormField, renderSelect } from '../../../components/Global'
import CustomTable from '../../../components/CustomTable'
import ImgCup from '../../../assets/images/cup.svg'
import ImgArrow from '../../../assets/images/arrow_download.svg'
import { Checkbox } from '../../../components/Checkbox'
import { useTranslation } from 'react-i18next'
import ModalSubscription from '../../Admin/ModalSubscription'
import { Link } from 'react-router-dom'
import { getAppointments } from '../../../actions/appointment'
import ModalEditStudentLesson from '../../Admin/ModalEditStudentLesson'
import { Avatar } from '../../../components/Avatar'
import Loader from 'react-spinners/ClipLoader'

const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const StudentProfile = ({ user, update, isAdmin }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [t, i18n] = useTranslation('translation')
  const student_info = useSelector(state => state.students.student_info)
  const loading = useSelector(state => state.students.loading)
  const [isSubscriptionModal, setIsSubscriptionModal] = useState(false)
  const appointments = useSelector(state => state.appointment.list)
  const appointments_loading = useSelector(state => state.appointment.loading)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [visibleEditLesson, setVisibleEditLesson] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [upcomingLessons, setUpcomingLessons] = useState([])
  const [pastLessons, setPastLessons] = useState([])
  const [formData, setFormData] = useState({
    interests: student_info?.interests,
    level: student_info?.level
      ? {
          value: student_info?.level,
          label: `Level ${student_info?.level}`
        }
      : null
  })
  const [formDataError, setFormDataError] = useState({
    interests: '',
    level: ''
  })

  useEffect(() => {
    dispatch(getStudent(user?.student_profile?.id))
    let queryObj = {}
    if (user.student_profile) {
      queryObj.student_id = user.student_profile.id
    }
    dispatch(getAppointments(queryObj))
  }, [dispatch])

  useEffect(() => {
    if (appointments) {
      let enrolled = {}
      appointments.forEach(apt => {
        const key = apt.type + apt.lesson.type
        if (!enrolled[key]) {
          enrolled[key] = true
        }
      })
      setEnrolledCourses(enrolled)
      setRefresh(!refresh)
      setUpcomingLessons(filterLessonsByStatus('upcoming', appointments))
      setPastLessons(filterLessonsByStatus('past', appointments))
    }
  }, [appointments])

  useEffect(() => {
    if (student_info && student_info.level) {
      setFormData({
        ...formData,
        level: {
          value: student_info.level,
          label: `Level ${student_info.level}`
        }
      })
    }
  }, [student_info])

  // ===================================================
  const columns = [
    {
      title: t('student_name'),
      dataKey: 'student',
      width: 20,
      render: (text, record) => (
        <div className='with-avatar'>
          <Avatar
            avatar={record.img}
            name={getAvatarName(record.first_name, record.last_name)}
          />
          <p>{getAbbrName(record.first_name, record.last_name)}</p>
        </div>
      )
    },
    {
      title: t('lesson_date'),
      dataKey: 'lessonDate',
      width: 20
    },
    {
      title: t('level'),
      dataKey: 'level',
      width: 20,
      render: item => <span>{t('level_n', { n: item ? item : 1 })}</span>
    },
    {
      title: t('lesson_topic'),
      dataKey: 'lessonType',
      width: 20
    }
  ]

  const columns_upcoming = [
    ...columns,
    {
      title: t('completed_lessons'),
      dataKey: 'completed',
      width: 20,
      render: (item, record) => {
        return (
          <div className='actions'>
            {record.seat_count === 1 && (
              <a
                onClick={() => {
                  setSelectedLesson(record)
                  setVisibleEditLesson(true)
                }}
              >
                {t('reschedule')}
              </a>
            )}
          </div>
        )
      }
    }
  ]

  const columns_past = [
    ...columns,
    {
      title: t('where_left'),
      dataKey: 'completed',
      width: 20,
      render: (item, record) => (
        <div className='actions'>
          {record.completed ? (
            <span>{t('finished')}</span>
          ) : (
            <span>{t('unfinished')}</span>
          )}
        </div>
      )
    }
  ]

  // ========================================

  const validateInput = (value, stateName) => {
    if (!value) {
      setFormDataError(formDataError => ({
        ...formDataError,
        [stateName]: t('error_field_not_empty')
      }))
      return false
    } else {
      setFormDataError(formDataError => ({
        ...formDataError,
        [stateName]: ''
      }))
      return true
    }
  }

  const onChange = (value, stateName) => {
    validateInput(value, stateName)
    setFormData({ ...formData, [stateName]: value })
  }

  const [selectedLanguageLevel, setSelectedLanguageLevel] = useState(
    languageLevels.find(item => item.value === student_info?.lang_level)
  )

  const handleChange = (option, stateName) => {
    const name = stateName.name
    if (name === 'lang_level' || name === 'level') {
      setSelectedLanguageLevel(option)
      setFormDataError(formDataError => ({ ...formDataError, [name]: '' }))
      setFormData({ ...formData, [name]: option })
    } else {
      setFormDataError(formDataError => ({
        ...formDataError,
        [stateName]: ''
      }))
      setFormData({ ...formData, [stateName]: option })
    }
  }

  const onChangeCourseType = () => {}

  const updateProfile = async () => {
    const result = Object.keys(formData).map(key => {
      return validateInput(formData[key], key)
    })

    const isInvalid = result.filter(r => !r).length > 0

    let respStudent = await dispatch(
      updateStudent({
        ...formData,
        user_id: user?.id,
        level: formData.level?.value
      })
    )

    if (respStudent.type === 'UPDATE_STUDENT_PROFILE_SUCCESS') {
      
      if (!isAdmin) {
        history.push('/student/profile')
      }
    }

    if (respStudent.type === 'UPDATE_STUDENT_PROFILE_FAILURE') {
      NotificationManager.error(t('update_profile_failed'), t)
    }
  }

  useEffect(() => {
    if (update) {
      updateProfile()
    }
  }, [update])

  return (
    <div className='profile-inner-wrapper'>
      {!isSubscriptionModal && (
        <>
          <div className='form-section'>
            {/* {renderFormField(
              'interests',
              t('interests'),
              handleChange,
              formData,
              formDataError,
              'textfield'
            )} */}

            {/* <p className='section-title custom-section-title'>
              {t('enrolled_in_following_courses')}
            </p> */}
            {/* <div className='courses'>
              {courses.map((course, index) => (
                <div className='course' key={`course-${index}`}>
                  <label>{t(course.label)}</label>
                  <div className='options'>
                    {course.options.map((opt, idx) => {
                      const key = course_options[opt].value + course.value
                      return (
                        <Checkbox
                          key={`checkbox-${index}-${idx}`}
                          label={course_options[opt].label}
                          checked={enrolledCourses[key]}
                          onChange={() => {}}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div> */}
            <Link to='/student/packages' className='btn-see-pricing-options'>
              {t('see_pricing_options')}
            </Link>

            <p className='section-title custom-section-title'>
              {t('your_level_achieved')}
            </p>
            <div className='achivement-wrapper'>
              <div className='achivements'>
                {student_info &&
                  numbers
                    .slice(0, student_info.level ? student_info.level : 1)
                    .map(index => <img src={ImgCup} alt='' />)}
              </div>
              {/* {isAdmin ? (
                renderSelect(
                  'level',
                  t('level'),
                  t('level'),
                  [
                    { value: 'pre-level1', label: 'Pre-Level 1' },
                    ...new Array(10).fill().map((_, idx) => ({
                      value: idx + 1,
                      label: `Level ${idx + 1}`
                    }))
                  ],
                  formData.level,
                  handleChange
                )
              ) : (
                <div className='level'>
                  {t('level_n', {
                    n: student_info.level ? student_info.level : 1
                  })}
                </div>
              )}
              <div className='congrat'>{t('congratulations')}</div>
              <div className='btn-download'>
                <img src={ImgArrow} alt='' />
                <span>{t('download_certificate_pdf')}</span>
              </div> */}
            </div>

            {isAdmin && (
              <>
                <p className='section-title custom-section-title'>
                  {t('upcoming_lessons')}
                </p>
                {appointments_loading ? (
                  <Loader
                    className='align-center'
                    type='Audio'
                    color='#00BFFF'
                    height={50}
                    width={50}
                  />
                ) : (
                  <CustomTable
                    className='full-height'
                    data={upcomingLessons}
                    columns={columns_upcoming}
                  />
                )}

                <p className='section-title custom-section-title'>
                  {t('past_lessons')}
                </p>
                {appointments_loading ? (
                  <Loader
                    className='align-center'
                    type='Audio'
                    color='#00BFFF'
                    height={50}
                    width={50}
                  />
                ) : (
                  <CustomTable
                    className='full-height'
                    data={pastLessons}
                    columns={columns_past}
                  />
                )}
              </>
            )}
          </div>
        </>
      )}
      {isSubscriptionModal && (
        <ModalSubscription
          user={user}
          visible={isSubscriptionModal}
          onDismiss={() => setIsSubscriptionModal(false)}
        />
      )}
      {visibleEditLesson && (
        <ModalEditStudentLesson
          visible={visibleEditLesson}
          onDismiss={() => setVisibleEditLesson(false)}
          student={selectedLesson.student}
          date={new Date(selectedLesson.lessonDate)}
        />
      )}
    </div>
  )
}

export default StudentProfile
