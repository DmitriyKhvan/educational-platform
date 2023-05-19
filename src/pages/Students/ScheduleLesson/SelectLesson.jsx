import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/Layout';
import scheduleTick from '../../../assets/images/scheduleTick.svg';
import continue_arrow from '../../../assets/images/continue_arrow.svg';

const SelectLesson = ({
  setSelectedPlan,
  setTabIndex,
  clicked,
  setClicked,
  lesson,
}) => {
  const [t] = useTranslation(['lessons', 'common']);
  const history = useHistory();
  const { id } = useParams();
  const planStatus = useSelector((state) => state.students.planStatus);
  const disabled = clicked === null ? true : false;

  useEffect(() => {
    if (lesson) {
      setSelectedPlan(planStatus[0]);
      setTabIndex(1);
    }
  }, [lesson]);

  const returnToDashboard = () => {
    history.push('/student/manage-lessons');
  };

  const LessonCard = ({
    lesson,
    duration,
    remaining,
    data,
    i,
    expirationDate,
  }) => {
    return (
      <div className="pe-2 col-lg-4 main-container schedule-lesson">
        <div
          className={`schedule-card small-card lesson-container pt-2 ${
            i === clicked
              ? 'purple-border'
              : 'schedule-card small-card lesson-container pt-2'
          }`}
          onClick={() => {
            setClicked(i);
            setSelectedPlan(data);
          }}
        >
          <div className="container-fluid">
            <div className="row mb-3">
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
            <div className="row mb-1">
              <div className="time_remaining">
                {duration} {t('minutes', { ns: 'common' })}
              </div>
              <div className="remaining-lsn">
                {remaining} {t('lessons_remaining')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="scroll-layout  schedule-lesson">
        <div className="flex-container">
          <div className="custom-children-container m-0 schedule_changess max-select_lesson">
            <div className="flex-left">
              <h1 className="title mt-0 title_aligns_slesson">
                {!id ? t('schedule_lesson') : t('reschedule_lesson')}
              </h1>
              <p className="welcome-subtitle">
                {!id
                  ? t('schedule_lesson_subtitle')
                  : t('reschedule_lesson_subtitle')}
              </p>
            </div>
            <div className="ExpWidth-con">
              <div className="lesson_card-inline">
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
            <div className="row container pt-3 btn-custom ">
              <div className="col-auto">
                <button
                  className="enter-btn btn-dash-return ms-0 button_schedule"
                  onClick={returnToDashboard}
                >
                  {t('return_to_dash')}
                </button>
              </div>
              <div className="col-auto">
                <button
                  className="enter-btn btn-primary button_schedule custom-btn-primary"
                  disabled={disabled}
                  onClick={() => setTabIndex(1)}
                >
                  <span className="me-2">{t('continue_custom')}</span>
                  <span className="continue-arrow">
                    <img src={continue_arrow} alt="" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectLesson;
