import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Layout from '../../../components/Layout'

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

  const LessonCard = ({ lesson, duration, remaining, data, i }) => {
    return (
      <div
        className='col-6 pe-4'
        onClick={() => {
          setClicked(i)
          setSelectedPlan(data)
        }}
      >
        <div
          className={`schedule-card small-card pt-2 ${
            i === clicked ? 'purple-border' : ''
          }`}
        >
          <div className='container-fluid py-3'>
            <div className='row'>
              <h1 className={`${i === clicked ? 'text-purple' : 'text-black'}`}>
                {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
              </h1>
            </div>
            <div className='row'>
              <div
                className='col-4 schedule-lesson-border me-2'
                style={{ background: '#DEDEE1' }}
              >
                <p className='m-2' style={{ textAlign: 'center' }}>
                  <strong>
                    {duration} {t('minutes')}
                  </strong>
                </p>
              </div>
              <div className='col-7 schedule-lesson-border ms-2'>
                <p className='m-2' style={{ textAlign: 'center' }}>
                  <strong>
                    {remaining} {t('lessons_remaining')}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className='container'>
            <div className='children-wrapper flex-left'>
              <h1 className='title'>{t('schedule_lesson')}</h1>
              <p className='welcome-subtitle'>
                {t('schedule_lesson_subtitle')}
              </p>
            </div>

            <div className='row container'>
              {planStatus.map((x, i) => (
                <LessonCard
                  lesson={x.lesson_type}
                  duration={x.duration}
                  remaining={x.total_lessons}
                  data={x}
                  i={i}
                  key={i}
                />
              ))}
            </div>
            <div className='row container pt-3'>
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
                  className='enter-btn btn-primary'
                  disabled={disabled}
                  onClick={() => setTabIndex(1)}
                >
                  {t('continue')}
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
