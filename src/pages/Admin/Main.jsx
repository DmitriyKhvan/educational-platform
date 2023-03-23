import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import '../../assets/styles/admin.scss'
import { useTranslation } from 'react-i18next'
import ImgStudent from '../../assets/images/student.svg'
import ImgTutor from '../../assets/images/tutor.svg'
import ImgInfo from '../../assets/images/info.svg'

import { EditPaymentModal } from './ModalEditPayment'
import { useDispatch, useSelector } from 'react-redux'

import {
  fetchStudents,
  fetchTutors,
  getUserById,
  fetchTutorRates,
  updateTutorHourlyRate
} from '../../actions/admin'
import { getAbbrName } from '../../constants/global'
import ModalEditStudentLesson from './ModalEditStudentLesson'
import ModalEditTutorLesson from './ModalEditTutorLesson'
import { ModalUserInfo } from './ModalUserInfo'
import Profile from '../../newPages/profile/SwitchProfile'

const Main = () => {
  const [t, i18n] = useTranslation('translation')
  const [visibleEditPaymentModal, setVisibleEditPaymentModal] = useState(false)

  const students = useSelector(state => state.admin.students)
  const tutors = useSelector(state => state.admin.tutors)
  const [showStudents, setShowSutdents] = useState(false)
  const [showTutors, setShowTutors] = useState(false)
  const [showTutors1, setShowTutors1] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [selectedTutor1, setSelectedTutor1] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [tutorName, setTutorName] = useState('')
  const [tutorName1, setTutorName1] = useState('')
  const [visibleStudentLessonModal, setVisibleStudentLessonModal] = useState(
    false
  )
  const [visibleTutorLessonModal, setVisibleTutorLessonModal] = useState(false)
  const [selectedDateStudent, setSelectedDateStudent] = useState('')
  const [selectedDateTutor, setSelectedDateTutor] = useState('')
  const [visibleProfileModal, setVisibleProfileModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const user = useSelector(state => state.admin.user)
  const loading_user = useSelector(state => state.admin.loading)
  const tutorRates = useSelector(state => state.admin.rates)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!tutors || (tutors && tutors.length === 0)) {
      dispatch(fetchTutors({ sort_by: 'name' }))
    }
    if (!students || (students && students.length === 0)) {
      dispatch(fetchStudents({ sort_by: 'name' }))
    }

    dispatch(fetchTutorRates())
  }, [dispatch])

  const onSave = prices => {
    setVisibleEditPaymentModal(false)
    dispatch(updateTutorHourlyRate({ rates: prices }))
  }

  useEffect(() => {
    if (selectedUser && selectedUser.user_id) {
      dispatch(getUserById(selectedUser.user_id))
    }
  }, [selectedUser])

  const onGoToProfile = () => {
    setVisibleProfileModal(true)
    setVisibleStudentLessonModal(false)
    setVisibleTutorLessonModal(false)
  }

  return (
    <Layout>
      <div className='admin-main-layout'>
        <div className='page-header'>
          <h4 className='main-title'>{t('tutor_list')}</h4>
        </div>
        <div className='divider' />

        <div className='scroll-layout'>
          <p className='sub-title'>{t('edit_tutor_student_details')}</p>
          <div className='list-page-select'>
            <div className='page-card'>
              <img src={ImgStudent} alt='' />
              <a href='/admin/tutor-list' className='enter-btn'>
                {t('goto_tutor_list')}
              </a>
            </div>
            <div className='page-card'>
              <img src={ImgTutor} alt='' />
              <a href='/admin/student-list' className='enter-btn'>
                {t('goto_student_list')}
              </a>
            </div>
          </div>

          <p className='sub-title'>{t('manage_classes')}</p>
          <div className='manage-classes-wrapper'>
            <div className='class-card'>
              <p className='title'>{t('change_student_class')}</p>
              <div className='search-row'>
                <div>{t('find_student')}</div>
                <div>
                  <input
                    type='text'
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder={t('search_student')}
                    onClick={() => setShowSutdents(!showStudents)}
                  />
                  {showStudents && (
                    <div className='popup'>
                      {students
                        .filter(
                          student =>
                            studentName === '' ||
                            (student.first_name + ' ' + student.last_name)
                              .toLowerCase()
                              .indexOf(studentName.toLowerCase()) > -1
                        )
                        .map((student, index) => (
                          <span
                            key={`student-${index}`}
                            onClick={() => {
                              setSelectedStudent({
                                ...student,
                                user: {
                                  avatar: student.avatar,
                                  first_name: student.first_name,
                                  last_name: student.last_name
                                }
                              })
                              setShowSutdents(false)
                              setStudentName(
                                student.first_name + ' ' + student.last_name
                              )
                            }}
                          >
                            {getAbbrName(student.first_name, student.last_name)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <a
                href='#'
                className='enter-btn right'
                onClick={() => {
                  if (selectedStudent) {
                    setVisibleStudentLessonModal(true)
                    setSelectedUser(selectedStudent)
                  }
                }}
              >
                {t('open_details')}
              </a>
            </div>
            <div className='class-card'>
              <p className='title'>{t('change_student_class')}</p>
              <div className='search-row'>
                <div>{t('find_tutor')}</div>
                <div>
                  <input
                    type='text'
                    value={tutorName}
                    onChange={e => setTutorName(e.target.value)}
                    placeholder={t('search_tutor')}
                    onClick={() => setShowTutors(!showTutors)}
                  />
                  {showTutors && (
                    <div className='popup'>
                      {tutors
                        .filter(
                          tutor =>
                            tutorName === '' ||
                            (tutor.first_name + ' ' + tutor.last_name)
                              .toLowerCase()
                              .indexOf(tutorName.toLowerCase()) > -1
                        )
                        .map((tutor, index) => (
                          <span
                            key={`tutor-${index}`}
                            onClick={() => {
                              setSelectedTutor({
                                ...tutor,
                                user: {
                                  avatar: tutor.avatar,
                                  first_name: tutor.first_name,
                                  last_name: tutor.last_name
                                }
                              })
                              setShowTutors(false)
                              setTutorName(
                                tutor.first_name + ' ' + tutor.last_name
                              )
                            }}
                          >
                            {getAbbrName(tutor.first_name, tutor.last_name)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <a
                href='#'
                className='enter-btn right'
                onClick={() => {
                  if (selectedTutor) {
                    setVisibleTutorLessonModal(true)
                    setSelectedUser(selectedTutor)
                  }
                }}
              >
                {t('open_details')}
              </a>
            </div>
          </div>

          <p className='sub-title'>{t('tutor_time_availability')}</p>
          <div className='manage-classes-wrapper'>
            <div className='class-card'>
              <p className='title'>{t('tutor_time_availability')}</p>
              <div className='search-row'>
                <span />
                <div>
                  <input
                    type='text'
                    value={tutorName1}
                    onChange={e => setTutorName1(e.target.value)}
                    placeholder={t('search_tutor')}
                    onClick={() => setShowTutors1(!showTutors1)}
                  />
                  {showTutors1 && (
                    <div className='popup'>
                      {tutors
                        .filter(
                          tutor =>
                            tutorName1 === '' ||
                            (tutor.first_name + ' ' + tutor.last_name)
                              .toLowerCase()
                              .indexOf(tutorName1.toLowerCase()) > -1
                        )
                        .map((tutor, index) => (
                          <span
                            key={`tutor-${index}`}
                            onClick={() => {
                              setSelectedTutor1({
                                ...tutor,
                                user: {
                                  avatar: tutor.avatar,
                                  first_name: tutor.first_name,
                                  last_name: tutor.last_name
                                }
                              })
                              setShowTutors1(false)
                              setTutorName1(
                                tutor.first_name + ' ' + tutor.last_name
                              )
                            }}
                          >
                            {getAbbrName(tutor.first_name, tutor.last_name)}
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
              <a
                href='#'
                className='enter-btn'
                onClick={() => {
                  setVisibleProfileModal(true)
                  setSelectedUser(selectedTutor1)
                }}
              >
                {t('open_details')}
              </a>
            </div>
          </div>

          <p className='sub-title'>{t('standard_tutor_payments')}</p>
          <div className='manage-classes-wrapper'>
            {tutorRates.map((rate, idx) => {
              return (
                <div className='class-card' key={idx}>
                  <p className='title'>{`${rate.type} LESSON (${rate.duration} mins)`}</p>
                  <p className='amount'>$ {rate.rate}</p>
                </div>
              )
            })}
          </div>
          <div className='edit-payment'>
            <div
              href='#'
              className='enter-btn width-126'
              onClick={() => setVisibleEditPaymentModal(true)}
            >
              {t('edit_payment')}
            </div>
            <p>
              <img src={ImgInfo} alt='' /> {t('set_individual_tutor_payment')}
            </p>
          </div>
          {/* <p className="sub-title">{t('sales_discounts')}</p>
          <div className="list-page-select">
            <div className="page-card">
              <img src={ImgSale} alt="" />
              <a href="/admin/tutor-list" className="enter-btn">{t('add_sale_package')}</a>
            </div>
            <div className="page-card">
              <div>
                <img src={ImgDiscount} alt="" />
                <label>{t('percent_off')}</label>
              </div>
              <a href="/admin/student-list" className="enter-btn">{t('add_discount_package')}</a>
            </div>
          </div> */}
        </div>
      </div>
      {visibleEditPaymentModal && (
        <EditPaymentModal
          tutorRates={tutorRates}
          visible={visibleEditPaymentModal}
          onDismiss={() => setVisibleEditPaymentModal(false)}
          onSave={onSave}
        />
      )}
      {visibleStudentLessonModal && (
        <ModalEditStudentLesson
          visible={visibleStudentLessonModal}
          onDismiss={() => setVisibleStudentLessonModal(false)}
          onGoToProfile={onGoToProfile}
          student={selectedStudent}
          date={new Date()}
        />
      )}
      {visibleTutorLessonModal && (
        <ModalEditTutorLesson
          visible={visibleTutorLessonModal}
          onDismiss={() => setVisibleTutorLessonModal(false)}
          onGoToProfile={onGoToProfile}
          tutor={selectedUser}
          date={new Date()}
        />
      )}
      {visibleProfileModal && user && !loading_user && (
        <ModalUserInfo
          title={t(
            Object.keys(selectedUser).indexOf('zoom_link') > -1
              ? 'tutor_profile'
              : 'student_profile'
          )}
          visible={visibleProfileModal}
          onDismiss={() => setVisibleProfileModal(false)}
        >
          <div className='scroll-layout'>
            <Profile user={user} isAdmin={true} />
          </div>
        </ModalUserInfo>
      )}
    </Layout>
  )
}

export default Main
