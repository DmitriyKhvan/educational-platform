/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react'
import Modal from './Modal'
import '../assets/styles/student.scss'
import '../assets/styles/admin.scss'
import { useTranslation } from 'react-i18next'
import CustomTable from './CustomTable'
import { format, addDays, subDays } from 'date-fns'
import LeftArrow from '../assets/images/left-arrow.svg'
import RightArrow from '../assets/images/right-arrow.svg'
import { getAbbrName } from '../constants/global'
import { cancel_lesson_reasons_tutor } from '../constants/global'
import { ModalCancelLesson } from './ModalCancelLesson'
import { cancelAppointment } from '../actions/appointment'
import { useDispatch } from 'react-redux'
import ActionTypes from '../constants/actionTypes'
import NotificationManager from './NotificationManager'

const ModalDateLesson = ({
  user,
  onDismiss,
  visible,
  date,
  lessonData,
  onChangeDate,
  onViewTutor
}) => {
  const [t] = useTranslation('translation')
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(new Date(date))
  const [columns, setColumns] = useState([])
  const [isTutor, setIsTutor] = useState(null)
  const [lessons, setLessons] = useState([])
  const [visibleCancel, setVisibleCancel] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    let isTutor = null
    if (user && user.roles) {
      isTutor = user.roles[0].role_name === 'tutor'
      setIsTutor(isTutor)
      let columns = [
        {
          title: isTutor ? t('student_name') : t('tutor_name'),
          dataKey: 'name',
          width: 30
        },
        {
          title: t('lesson_time'),
          dataKey: 'start_at',
          width: 40,
          render: (text, record) => {
            let date = new Date(text)
            let from = format(date, 'hh:mm aa')
            date.setMinutes(date.getMinutes() + parseInt(record.duration))
            let to = format(date, 'hh:mm aa')
            return (
              <p>
                {from} - {to}
              </p>
            )
          }
        },
        {
          title: isTutor ? t('level') : t('course'),
          dataKey: isTutor ? 'level' : 'course',
          width: 30,
          render: text => (
            <p>
              {isTutor ? 'Level #' : ''} {text ? text : 1}
            </p>
          )
        }
        // , {
        //   title: t('lesson_number'),
        //   dataKey: 'id',
        //   width: 20,
        // }
      ]
      if (!isTutor && currentDate >= today) {
        columns = [
          ...columns,
          {
            title: 'Action',
            dataKey: 'actions',
            width: 40,
            render: (_, record) => (
              <div className='actions'>
                <a href={record.zoomInfo} target='_blank' rel='noreferrer'>
                  {t('join_lesson')}
                </a>
              </div>
            )
          }
        ]
      } else {
        if (currentDate >= today) {
          columns = [
            ...columns,
            {
              title: 'Action',
              dataKey: 'actions',
              width: 40,
              render: (_, record) => (
                <div className='actions'>
                  <a
                    onClick={() => {
                      setSelectedLesson(record)
                      setVisibleCancel(true)
                    }}
                    className='outlined'
                  >
                    {t('cancel_lesson')}
                  </a>
                  <a href={record.zoomInfo} target='_blank' rel='noreferrer'>
                    {t('join_lesson')}
                  </a>
                </div>
              )
            }
          ]
        }
      }
      columns = columns.map(column => ({
        ...column,
        width: 100 / columns.length
      }))
      setColumns(columns)
    }
  }, [user])

  useEffect(() => {
    if (lessonData) {
      const lessons = lessonData.map(apt => {
        let lesson = {
          id: apt.id,
          course: apt.lesson.type,
          start_at: apt.start_at,
          duration: apt.duration
        }
        if (isTutor) {
          lesson = {
            ...lesson,
            name: getAbbrName(
              apt.students[0].user.first_name,
              apt.students[0].user.last_name
            ),
            level: apt.students[0].level,
            zoomInfo: apt.zoomlink?.url
          }
        } else {
          lesson = {
            ...lesson,
            name: getAbbrName(
              apt.tutor ? apt.tutor.user?.first_name : apt.first_name,
              apt.tutor ? apt.tutor.user?.last_name : apt.last_name
            ),
            zoomInfo: apt.zoomlink?.url
          }
        }
        return lesson
      })
      setLessons(lessons)
    } else {
      setLessons([])
    }
  }, [lessonData])

  const nextMonth = () => {
    let newDate = addDays(currentDate, 1)
    setCurrentDate(newDate)
    onChangeDate(newDate, true)
  }

  const prevMonth = () => {
    let newDate = subDays(currentDate, 1)
    setCurrentDate(newDate)
    onChangeDate(newDate, true)
  }

  const onCancelLesson = async reasons => {
    const res = await dispatch(cancelAppointment(selectedLesson.id))
    if (res === ActionTypes.CANCEL_APPOINTMENT_INFO.SUCCESS) {
      NotificationManager.success(t('lesson_cancelled'), t)
      setVisibleCancel(false)
    }
  }

  return (
    <>
      <Modal className='user-info-modal' visible={visible} onCancel={onDismiss}>
        <div className='scroll-layout'>
          <div className='edit-student-lesson-wrapper'>
            <div className='pick-date'>
              <div className='icon' onClick={prevMonth}>
                <img src={LeftArrow} alt='' />
              </div>
              <div className='column col-center'>
                <span>{format(currentDate, 'eeee, do MMMM yyyy')}</span>
              </div>
              <div className='icon' onClick={nextMonth}>
                <img src={RightArrow} alt='' />
              </div>
            </div>
            <p className='sub-title'>Scheduled Lessons ({lessons.length})</p>
            <CustomTable
              className='full-height'
              data={lessons}
              columns={columns}
              enableSeeAll={false}
            />
          </div>
        </div>
      </Modal>
      <ModalCancelLesson
        visible={visibleCancel}
        onDismiss={() => setVisibleCancel(false)}
        onCancel={onCancelLesson}
        reasons={cancel_lesson_reasons_tutor}
        lesson={selectedLesson}
      />
    </>
  )
}

export default ModalDateLesson
