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
        className='col-12 col-xl-4 col-lg-6 col-md-6 col-sm-6 pe-2  select_top_align'
        onClick={() => {
          setClicked(i)
          setSelectedPlan(data)
        }}
      >
        <div
          className={` schedule-cardss small-card lesson-container  ${
            i === clicked ? 'purple-border' : ''
          }`}
        >
          <div className='py-3 '>
            <div className='d-flex'>
              <h1
                className={`${
                  i === clicked
                    ? 'text-purpless lessontext'
                    : 'text-black lessontext'
                }`}
              >
                {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
              </h1>
              <div className={`${i === clicked ? 'tickmark' : 'tickNone'}`}>
                <img src={scheduleTick} alt='scheduleTick' />
              </div>
            </div>
            <div className='customlabel'>
              <div
                className='schedule-lesson-border sublabel-1'
                >
                <div className='minutes_schedule_text'>
                  {duration} {t('minutes')}
                </div>
              </div>
              <div className='schedule-lesson-border ms-2 sublabel-2'>
                <div className=' sublabel2-txt'>
                  {remaining} {t('lessons_remaining')}
                </div>
              </div>
            </div>
          </div>
          {/* <div className='row container subWidth'>
            <p className='text-end text-danger mb-1 mt-text expires'>
              <span className='exp-txt'>{t('expires')}</span>
              <span className='colon-color'>:&nbsp;</span>
              <span className='exp-date'>
                {' '}
                {moment(expirationDate).format('MM-DD-YYYY')}
              </span>
            </p>
          </div> */}
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className='scroll-layout'>
        <div className='flex-container'>
          <div className='custom-children-container m-0 schedule_changess max-select_lesson'>
            <div className='flex-left'>
              <h1 className='title mt-0 title_aligns_slesson'>{t('schedule_lesson')}</h1>
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
            <div className='row  pt-3 btn-custom '>
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
