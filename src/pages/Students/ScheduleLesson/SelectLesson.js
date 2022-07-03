import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../../../components/Layout'
import moment from 'moment'
import scheduleTick from '../../../assets/images/scheduleTick.svg'
import continue_arrow from '../../../assets/images/continue_arrow.svg'
const SelectLesson = ({
  setSelectedPlan,
  setTabIndex,
  clicked,
  setClicked
}) => {
  const [t] = useTranslation('translation')
  const history = useHistory()
  const planStatus = useSelector(state => state.students.planStatus)
  const disabled = clicked === null ? true : false

  const returnToDashboard = () => {
    history.push('/student/manage-lessons')
  }

  const LessonCard = ({
    lesson,
    duration,
    remaining,
    data,
    i,
    expirationDate
  }) => {
    return (
      <div
        className='col-md-6 col-lg-4 pe-4 main-container '
        onClick={() => {
          setClicked(i)
          setSelectedPlan(data)
        }}
      >
        <div
          className={`schedule-card small-card lesson-container pt-2 ${
            i === clicked ? 'purple-border' : ''
          }`}
        >
          <div className='container-fluid py-3'>
            <div className='row'>
              <h1
                className={`${
                  i === clicked
                    ? 'text-purple lessontext'
                    : 'text-black lessontext'
                }`}
              >
                {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
              </h1>
              <span className={`${i === clicked ? 'tickmark' : 'tickNone'}`}>
                <img src={scheduleTick} alt='' />
              </span>
            </div>
            <div className='row customlabel'>
              <div
                className='col-4 schedule-lesson-border me-2 sublabel-1'
                style={{ background: '#DEDEE1' }}
              >
                <p className='m-2 inner-txt' style={{ textAlign: 'center' }}>
                  <strong>
                    {duration} {t('minutes')}
                  </strong>
                </p>
              </div>
              <div className='col-7 schedule-lesson-border ms-2 sublabel-2'>
                <p
                  className='m-2 inner-txt sublabel2-txt'
                  style={{ textAlign: 'center' }}
                >
                  <strong>
                    {remaining} {t('lessons_remaining')}
                  </strong>
                </p>
              </div>
            </div>
          </div>
          <div className='row container subWidth'>
            <p className='text-end text-danger mb-1 mt-text expires'>
              <span className='exp-txt'>{t('expires')}</span>
              <span className='colon-color'>:&nbsp;</span>
              <span className='exp-date'>
                {' '}
                {moment(expirationDate).format('MM-DD-YYYY')}
              </span>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className='container custom-children-container'>
            <div className='children-wrapper flex-left'>
              <h1 className='title'>{t('schedule_lesson')}</h1>
              <p className='welcome-subtitle'>
                {t('schedule_lesson_subtitle')}
              </p>
            </div>
            <div className='ExpWidth-con'>
              <div className='row container ExpWidth'>
                {planStatus.map((x, i) => (
                  <LessonCard
                    lesson={x.lesson_type}
                    duration={x.duration}
                    remaining={x.total_lessons}
                    data={x}
                    i={i}
                    key={i}
                    expirationDate={x.plan_end}
                  />
                ))}
              </div>
            </div>
            <div className='row container pt-3 btn-custom'>
              <div className='col-auto'>
                <button
                  className='enter-btn btn-dash-return ms-0'
                  onClick={returnToDashboard}
                >
                  {t('return_to_dash')}
                </button>
              </div>
              <div className='col-auto'>
                <button
                  className='enter-btn btn-primary custom-btn-primary'
                  disabled={disabled}
                  onClick={() => setTabIndex(1)}
                >
                  <span>{t('continue_custom')}</span>
                  <span className='continue-arrow'>
                    <img src={continue_arrow} alt='' />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default SelectLesson
