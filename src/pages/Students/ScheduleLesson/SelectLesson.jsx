import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/Layout';
import continue_arrow from '../../../assets/images/continue_arrow.svg';
import { useQuery } from '@apollo/client';
import { PACKAGE_QUERY } from '../../../modules/auth/graphql';
import { useAuth } from '../../../modules/auth';

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
  const { user } = useAuth();
  const {
    data: { packageSubscriptions: planStatus },
  } = useQuery(PACKAGE_QUERY, {
    variables: {
      id: user?.student?.id,
    },
  });
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

  const LessonCard = ({ lesson, duration, remaining, data, i }) => {
    return (
      <div className="px-2">
        <div
          className={`schedule-card small-card lesson-container rounded-xl px-3 pt-3 ${
            i === clicked
              ? 'border-[#6133af] border'
              : 'schedule-card small-card lesson-container rounded-xl px-3 pt-3'
          }`}
          onClick={() => {
            setClicked(i);
            setSelectedPlan(data);
          }}
        >
          <div className="">
            <h1
              className={`mb-2 ${i === clicked ? 'text-black' : 'text-black'}`}
            >
              {lesson.charAt(0).toUpperCase() + lesson.slice(1)}
            </h1>

            <div className="flex">
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
            <div className="flex flex-col gap-3">
              <h1 className="title mt-0 title_aligns_slesson">
                {!id ? t('schedule_lesson') : t('reschedule_lesson')}
              </h1>
              <p className="welcome-subtitle">
                {!id
                  ? t('schedule_lesson_subtitle')
                  : t('reschedule_lesson_subtitle')}
              </p>
            </div>
            <div className="">
              <div className="">
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
