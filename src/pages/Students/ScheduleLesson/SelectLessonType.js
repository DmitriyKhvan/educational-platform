import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../../../assets/styles/tutor.scss'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import ImgChecked from '../../../assets/images/checked_sm.svg'
import { differenceInDays } from 'date-fns'
import { getPlanStatus } from '../../../actions/subscription'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'

const SelectLessonType = ({ onContinue }) => {
  const dispatch = useDispatch()
  const [t, i18n] = useTranslation('translation')
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const planStatus = useSelector(state => state.students.planStatus)
  const loading = useSelector(state => state.students.loading)
  const history = useHistory()

  useEffect(() => {
    let data = {}
    const studentId = history.location.state && history.location.state.studentId
    if (studentId) data = { student_id: studentId }
    dispatch(getPlanStatus(data))
  }, [dispatch])

  const onSelect = (key, lesson) => {
    setSelectedIndex(key)
  }

  const onClickContinue = async () => {
    if (selectedIndex === -1) return

    const lesson = planStatus[selectedIndex]
    const course =
      lesson.lesson_type.indexOf('english') > -1
        ? 'english'
        : lesson.lesson_type.toLowerCase()
    const { duration, lesson_id } = lesson
    onContinue({
      lesson_id,
      course,
      duration
    })
  }

  const LessonCard = ({ lesson, index }) => {
    const selected = index === selectedIndex
    return (
      <div className={`lesson-card ${selected ? 'active' : ''}`}>
        <div>
          <div className="lesson-info">
            <p className="class">{lesson.lesson_type}</p>
            <p className="type">({lesson.group_type})</p>
          </div>
          <div>
            <div className="duration-box">
              <div className="divider" />
              <div className="first">
                <span className={`duration d-${lesson.duration}m`}>
                  {lesson.duration}m
                </span>
                <div>
                  <span>
                    {lesson.total_lessons - lesson.lessons} {t('lessons')}
                  </span>
                  <span>
                    {t('expired_in_days', {
                      n: differenceInDays(new Date(lesson.plan_end), new Date())
                    })}
                  </span>
                </div>
              </div>
              <div className="second">
                <div className="progress">
                  <div className="gray" />
                  <div
                    className="blue"
                    style={{
                      width:
                        Math.floor(
                          (lesson.lessons / lesson.total_lessons) * 100
                        ) + '%'
                    }}
                  />
                </div>
                <div className="plan">
                  {/* <span>{duration.plan} {t('plan')}</span> */}
                  <span>
                    {t('times_used', { n: lesson.lessons })}/{' '}
                    {lesson.total_lessons}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {lesson.total_lessons > lesson.lessons ? (
            <>
              {!selected && (
                <div
                  className="btn-choose-lesson"
                  onClick={() => {
                    onSelect(index)
                  }}
                >
                  {t('choose_lesson')}
                </div>
              )}
            </>
          ) : (
            <div className="selected-label">{t('not_available')}</div>
          )}
          {selected && (
            <div className="selected-label">
              <img src={ImgChecked} alt="" />
              {t('lesson_selected')}
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="schedule-lesson-layout">
      <h4 className="main-title">{t('schedule_lesson')}</h4>
      <div className="divider" />
      {loading ? (
        <Loader
          className="align-center"
          type="Audio"
          color="#00BFFF"
          height={50}
          width={50}
        />
      ) : planStatus.length === 0 ? (
        <span className="no-data">{t('no_lessons')}</span>
      ) : (
        <>
          <div className="lesson-detail-wraper">
            {planStatus
              .filter(p => p.group_type === '1-on-1')
              .map((lesson, index) => (
                <LessonCard
                  key={`lesson-card-${index}`}
                  index={index}
                  lesson={lesson}
                />
              ))}
          </div>
          <div className="btn-continue" onClick={onClickContinue}>
            {t('continue')}
          </div>
        </>
      )}
    </div>
  )
}

export default SelectLessonType
