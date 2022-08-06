import React, { useEffect, useState } from 'react'
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
    const [expDate, setExpDate] = useState()

    useEffect(() => {
      var date1 = new Date()
      var date2 = new Date(expirationDate)
      var Difference_In_Time = date2.getTime() - date1.getTime()
      // To calculate the no. of days between two dates
      var Difference_In_Days = Math.ceil(
        Difference_In_Time / (1000 * 3600 * 24)
      )
      setExpDate(Difference_In_Days)
    }, [])

    return (
      expDate < 0 && (
        <div className='col-md-6 col-lg-4 pe-4 main-container  schedule-lesson'>
          <div
            className={`schedule-card small-card lesson-container pt-2 ${
              i === clicked
                ? 'purple-border'
                : 'schedule-card small-card lesson-container pt-2'
            }`}
            onClick={() => {
              setClicked(i)
              setSelectedPlan(data)
            }}
          >
            <div className='container-fluid'>
              <div className='row'>
                <h1
                  className={`${
                    i === clicked
                      ? 'text-black lessontext'
                      : 'text-black lessontext'
                  }`}
                >
                  {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
                </h1>
              </div>
              <div className='row customlabel'>
                <p className='remaining-lsn' style={{ textAlign: 'center' }}>
                  {remaining} {t('lessons_remaining')}
                </p>

                <p className='time_remaining' style={{ textAlign: 'center' }}>
                  {duration} M
                </p>
              </div>
            </div>
            <hr className='line' />
            <div className='row container expiry-days'>
              <p className='expires'>
                {expDate > 0 ? (
                  <>
                    <span className='exp-txt exp-txt-purple'>{`${t(
                      'expires'
                    )}${' '}${expDate + ' ' + 'Days'}`}</span>
                  </>
                ) : (
                  <>
                    <span className='exp-txt exp-pad'>{t('expired')}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )
    )
  }

  return (
    <Layout>
      <div className='scroll-layout  schedule-lesson'>
        <div className='flex-container'>
          <div className='custom-children-container m-0 schedule_changess max-select_lesson'>
            <div className='flex-left'>
              <h1 className='title mt-0 title_aligns_slesson'>
                {t('schedule_lesson')}
              </h1>
              <p className='welcome-subtitle'>
                {t('schedule_lesson_subtitle')}
              </p>
            </div>
            <div className='ExpWidth-con'>
              <div className='row ExpWidth'>
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
            <div className='row container pt-3 btn-custom '>
              <div className='col-auto'>
                <button
                  className='enter-btn btn-dash-return ms-0 button_schedule'
                  onClick={returnToDashboard}
                >
                  {t('return_to_dash')}
                </button>
              </div>
              <div className='col-auto'>
                <button
                  className='enter-btn btn-primary button_schedule custom-btn-primary'
                  disabled={disabled}
                  onClick={() => setTabIndex(1)}
                >
                  <span className='me-2'>{t('continue_custom')}</span>
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
