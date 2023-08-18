import { useState } from 'react';
import '../../../assets/styles/tutor.scss';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import ImgChecked from '../../../assets/images/checked_sm.svg';
import { differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../modules/auth';
import { useQuery } from '@apollo/client';
import { PACKAGE_QUERY } from '../../../modules/auth/graphql';

const SelectLessonType = ({ onContinue }) => {
  const { user } = useAuth();
  const [t] = useTranslation('translation');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const {
    data: { packageSubscriptions: planStatus },
  } = useQuery(PACKAGE_QUERY, {
    variables: {
      id: user?.id,
    },
    fetchPolicy: 'network-only',
  });

  const onSelect = (key) => {
    setSelectedIndex(key);
  };

  const onClickContinue = async () => {
    if (selectedIndex === -1) return;

    const lesson = planStatus[selectedIndex];
    const {
      package: {
        id: packageId,
        course: { title: courseTitle },
        period: duration,
      },
    } = lesson;
    onContinue({
      packageId,
      courseTitle,
      duration,
    });
  };

  const LessonCard = ({ lesson, index }) => {
    const selected = index === selectedIndex;
    return (
      <div className={`lesson-card ${selected ? 'active' : ''}`}>
        <div>
          <div className="lesson-info">
            {/* <p className="class">{lesson.lesson_type}</p>
            <p className="type">({lesson.group_type})</p> */}
          </div>
          <div>
            <div className="duration-box">
              <div className="divider" />
              <div className="first">
                <span className={`duration d-${lesson.package.period}m`}>
                  {lesson.package.period}m
                </span>
                <div>
                  <span>
                    {lesson.credits} {t('lessons')}
                  </span>
                  <span>
                    {t('expired_in_days', {
                      n: differenceInDays(
                        new Date(lesson.periodEnd),
                        new Date(),
                      ),
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
                          (lesson.credits / lesson.package.totalSessions) * 100,
                        ) + '%',
                    }}
                  />
                </div>
                <div className="plan">
                  {/* <span>{duration.plan} {t('plan')}</span> */}
                  <span>
                    {t('times_used', { n: lesson.credits })}/{' '}
                    {lesson.package.totalSessions}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {lesson.package.totalSessions > lesson.credits ? (
            <>
              {!selected && (
                <div
                  className="btn-choose-lesson"
                  onClick={() => {
                    onSelect(index);
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
    );
  };

  return (
    <div className="schedule-lesson-layout">
      <h4 className="main-title">{t('schedule_lesson')}</h4>
      <div className="divider" />
      {planStatus.length === 0 ? (
        <span className="no-data">{t('no_lessons')}</span>
      ) : (
        <>
          <div className="lesson-detail-wraper">
            {planStatus.map((lesson, index) => (
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
  );
};

export default SelectLessonType;
