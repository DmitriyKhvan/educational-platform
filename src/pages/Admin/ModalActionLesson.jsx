import Modal from '../../components/Modal'
import '../../assets/styles/student.scss'
import { useTranslation } from 'react-i18next'
import CustomTable from '../../components/CustomTable'
import { useEffect, useState } from 'react'
import NotificationManager from '../../components/NotificationManager'
import { useDispatch, useSelector } from 'react-redux'
import { cancelAppointment, updateAppointment } from '../../actions/appointment'
import ImgChekced from '../../assets/images/checked.svg'
import { format } from 'date-fns'
import Loader from 'react-spinners/ClipLoader'
import { fetchTutors } from '../../actions/admin'
import { getAbbrName } from '../../constants/global'

export const ModalActionLesson = ({
  user,
  visible,
  title,
  subTitle,
  lesson,
  action,
  onDismiss,
  onAnotherAction
}) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const [newDate, setNewDate] = useState(new Date())
  const [actionDone, setActionDone] = useState(false)
  const loading = useSelector(state => state.appointment.loading)
  const tutors = useSelector(state => state.admin.tutors)
  const tutor_loading = useSelector(state => state.admin.loading)
  const [visibleTutors, setVisibleTutors] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)
  let columns = [
    {
      title: t('lesson_date'),
      dataKey: 'lessonDate',
      width: 40,
      render: item =>
        action === 'reschedule' ? (
          <input
            placeholder={t('pick_from_calendar')}
            type='date'
            onChange={onChangeDate}
          />
        ) : (
          <p>{item}</p>
        )
    },
    {
      title: t('tutor'),
      dataKey: 'tutor',
      width: 30,
      render: item =>
        action === 'assign' ? (
          <a href='#' className='btn' onClick={onClickChooseTutor}>
            {selectedTutor
              ? getAbbrName(selectedTutor.first_name, selectedTutor.last_name)
              : t('choose')}
          </a>
        ) : (
          <p>{item}</p>
        )
    },
    {
      title: t('lesson'),
      dataKey: 'lessonType',
      width: 30
    }
  ]

  const onChangeDate = e => {
    setNewDate(new Date(e.target.value))
  }

  const onClickChooseTutor = () => {
    setVisibleTutors(true)
    setSelectedTutor(null)
    if (!tutors || (tutors && tutors.length === 0)) {
      dispatch(fetchTutors())
    }
  }

  const onAction = async () => {
    if (action === 'delete') {
      await dispatch(cancelAppointment(lesson.id))
    } else {
      let data = {}
      if (action === 'reschedule') {
        let start_at = new Date()
        if (start_at > newDate) {
          NotificationManager.error(t('choose_another_day'), t)
          return
        }
        start_at = new Date(lesson.lessonDate)
        start_at.setFullYear(newDate.getFullYear())
        start_at.setMonth(newDate.getMonth())
        start_at.setDate(newDate.getDate())
        data = { start_at: start_at }
      } else {
        if (selectedTutor) {
          data = { tutor_id: selectedTutor.id }
        } else {
          NotificationManager.error(t('choose_another_tutor'), t)
        }
      }
      await dispatch(updateAppointment(lesson.id, data))
    }
    setActionDone(true)
  }

  return (
    <>
      {visible && (
        <Modal
          className='action-lesson-modal'
          visible={visible}
          onCancel={onDismiss}
        >
          {!actionDone ? (
            <>
              <div className='modal-title'>{title}</div>
              <div className='sub-title'>{subTitle}</div>
              <CustomTable
                className='full-height'
                data={[lesson]}
                columns={columns}
                enableSeeAll={false}
              />
              <div className='footer-content'>
                <div>
                  {action === 'delete' ? (
                    <p>
                      * This action cannot
                      <br />
                      be taken back.
                    </p>
                  ) : (
                    <>
                      <p>or</p>
                      <p
                        className='action'
                        onClick={() =>
                          onAnotherAction(
                            action === 'reschedule' ? 'assign' : 'reschedule'
                          )
                        }
                      >
                        {action === 'reschedule'
                          ? 'Assign Substitute'
                          : 'Reschedule'}
                      </p>
                      <svg
                        width='12'
                        height='25'
                        viewBox='0 0 12 36'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M11.5 1L0.5 35' stroke='#C4C4C4' />
                      </svg>
                      <p
                        className='action'
                        onClick={() => onAnotherAction('delete')}
                      >
                        {t('delete_lesson')}
                      </p>
                    </>
                  )}
                </div>
                <div>
                  <div className='btn-confirm' onClick={onAction}>
                    {t('confirm')}
                  </div>
                  {action === 'delete' && (
                    <div className='btn-confirm outlined' onClick={onDismiss}>
                      {t('cancel')}
                    </div>
                  )}
                </div>
                {loading && (
                  <div className='loading'>
                    <Loader
                      className='align-center'
                      type='Audio'
                      color='#00BFFF'
                      height={50}
                      width={50}
                    />
                  </div>
                )}
                {visibleTutors && (
                  <div className='tutors'>
                    <div className='content'>
                      {tutor_loading ? (
                        <Loader
                          className='align-center'
                          type='Audio'
                          color='#00BFFF'
                          height={50}
                          width={50}
                        />
                      ) : (
                        <>
                          <div className='listbox'>
                            {tutors &&
                              tutors.map((tutor, index) => (
                                <span
                                  key={`tutor-${index}`}
                                  className={
                                    selectedTutor &&
                                    selectedTutor.id === tutor.id
                                      ? 'selected'
                                      : ''
                                  }
                                  onClick={() => setSelectedTutor(tutor)}
                                >
                                  {getAbbrName(
                                    tutor.first_name,
                                    tutor.last_name
                                  )}
                                </span>
                              ))}
                          </div>
                          <div
                            className='btn'
                            onClick={() => {
                              if (selectedTutor !== null)
                                setVisibleTutors(false)
                            }}
                          >
                            Choose
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <img src={ImgChekced} alt='' />
              <p className='event'>
                {action === 'delete'
                  ? t('lesson_succssfully_deleted')
                  : action === 'assign'
                  ? t('lesson_succssfully_substituted')
                  : t('lesson_succssfully_rescheduled')}
              </p>
              {action === 'reschedule' && (
                <>
                  <p className='message'>{t('new_lesson_time')}</p>
                  <div className='box'>
                    <p>{format(newDate, 'MM/dd/yyyy hh:mm aa')}</p>
                  </div>
                </>
              )}
              {action === 'assign' && (
                <>
                  <p className='message'>{t('new_lesson_detail')}</p>
                  <div className='box'>
                    <span>
                      {format(
                        new Date(lesson.lessonDate),
                        'MM/dd/yyyy hh:mm aa'
                      )}
                    </span>
                    <span className='divider' />
                    <span>
                      {getAbbrName(
                        selectedTutor.first_name,
                        selectedTutor.last_name
                      )}
                    </span>
                    <span className='divider' />
                    <span>{lesson.lessonType}</span>
                  </div>
                </>
              )}
              {action === 'delete' && (
                <>
                  <br />
                  <br />
                  <br />
                </>
              )}
            </>
          )}
        </Modal>
      )}
    </>
  )
}
