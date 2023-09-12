import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment-timezone';
import NotificationManager from '../../../components/NotificationManager';
import Layout from '../../../components/Layout';
import ScheduleCard from './ScheduleCard';
import TutorImageRow from './TutorImageRow';
import ScheduleCardComponent from '../../../components/student-dashboard/ScheduleCard';
import Loader from '../../../components/common/Loader';
import { useAuth } from '../../../modules/auth';
import LessonCard from './LessonCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  APPOINTMENTS_QUERY,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
  // LESSON_QUERY,
} from '../../../modules/auth/graphql';

import CheckboxField from '../../../components/Form/CheckboxField';

const LessonConfirmation = ({
  plan,
  tutor,
  time,
  setTabIndex,
  lessonId = null,
  isMentorScheduled = false,
}) => {
  const [t] = useTranslation([
    'common',
    'lessons',
    'dashboard',
    'translations',
  ]);

  const urlParams = new URLSearchParams(window.location.search);
  const [repeat, setRepeat] = useState(
    JSON.parse(urlParams.get('repeatLessons') || false),
  );

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [newAppointment, setNewAppointment] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  // const [, setDate] = useState();
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [getAppointments] = useLazyQuery(APPOINTMENTS_QUERY, {
    variables: {
      studentId: user?.students[0]?.id,
      status: 'scheduled',
    },
    fetchPolicy: 'network-only',
  });
  const [createAppointment] = useMutation(CREATE_APPOINTMENT);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);
  // const [getLesson] = useLazyQuery(LESSON_QUERY);

  const fetchAppointments = async () => {
    return (await getAppointments()).data;
  };
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cancelled = async () => {
    setIsConfirmed(false);
    setNewAppointment([]);
  };

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scheduleDate = moment(time).tz(userTimezone).format('dddd, MMM DD');

  const scheduleStartTime = moment(time).tz(userTimezone).format('hh:mm A');
  const scheduleEndTime = moment(time)
    .tz(userTimezone)
    .add(plan?.package?.sessionTime, 'minutes')
    .format('hh:mm A');

  const confirmLesson = async () => {
    setIsLoading(true);

    /* this means if the lesson ID exists, its going to be a reschedule */
    let lesson = null;
    if (lessonId) {
      setIsLoading(true);
      // const oldLesson = await getLesson({
      //   variables: {
      //     id: lessonId,
      //   },
      // });
      // if (
      //   !moment
      //     .utc(time, 'ddd MMM DD YYYY HH:mm:ssZ')
      //     .isSame(oldLesson.data.lesson.startAt)
      // ) {
      //   const { data: { lesson: updatedLesson } = {} } =
      //     await updateAppointment({
      //       variables: {
      //         id: lessonId,
      //         mentorId: tutor.id,
      //         startAt: moment
      //           .utc(time, 'ddd MMM DD YYYY HH:mm:ssZ')
      //           .toISOString(),
      //         repeat: repeat,
      //       },
      //       onError: (error) => {
      //         NotificationManager.error(error.message, t);
      //       },
      //     });
      //   lesson = updatedLesson;
      // } else {
      //   NotificationManager.error(
      //     'The reschedule date cannot be the old scheduled date!',
      //     t,
      //   );
      // }
      const { data: { lesson: updatedLesson } = {} } = await updateAppointment({
        variables: {
          id: lessonId,
          mentorId: tutor.id,
          startAt: moment.utc(time, 'ddd MMM DD YYYY HH:mm:ssZ').toISOString(),
          repeat: repeat,
        },
        onError: (error) => {
          NotificationManager.error(error.message, t);
        },
      });
      lesson = updatedLesson;
    } else {
      try {
        const { data: { lesson: createdLesson } = {} } =
          await createAppointment({
            variables: {
              mentorId: tutor.id,
              studentId: user.students[0].id,
              subscriptionId: plan?.id,
              startAt: moment
                .utc(time, 'ddd MMM DD YYYY HH:mm:ssZ')
                .toISOString(),
              duration: plan?.package?.sessionTime,
              repeat: repeat,
            },
          });
        lesson = createdLesson;
      } catch (error) {
        NotificationManager.error(error.message, t);
      } finally {
        setIsLoading(false);
      }
    }
    if (lesson) {
      setConfirmDisable(true);
      setNewAppointment(lesson);
      // setDate(moment(lesson.startAt).unix());
      setIsConfirmed(true);
      window.scrollTo(0, 0);
    }
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="scroll-layout">
        <div className="flex-container">
          <div className=" children-wrapper tutor-confirm-left flex-left ">
            <div className="set-container_tutor">
              <h1 className="title my-2 mt-0 confirm-tutor-title">
                {t('confirmation', { ns: 'lessons' })}
              </h1>
              <p className="welcome-subtitle confirm-tutor-subtitle">
                {t('confirmation_subtitle', { ns: 'lessons' })}
              </p>
              <div className="flex gap-2 md:gap-2 lg:gap-3 ">
                <div className="button-size">
                  <button
                    className="confirm-tutor-enter-btn mobile-width"
                    onClick={() => setTabIndex(0)}
                  >
                    {t('edit_lesson', { ns: 'lessons' })}
                  </button>
                </div>
                <div className="button-size">
                  <button
                    className="confirm-tutor-enter-btn mobile-width"
                    onClick={() => setTabIndex(1)}
                  >
                    {t('edit_schedule', { ns: 'lessons' })}
                  </button>
                </div>
                <div className="button-size">
                  <button
                    className="confirm-tutor-enter-btn mobile-width"
                    onClick={() =>
                      isMentorScheduled
                        ? history.push('/student/mentors-list')
                        : setTabIndex(2)
                    }
                  >
                    {t('edit_mentor', { ns: 'lessons' })}
                  </button>
                </div>
              </div>

              <p className="welcome-subtitle pt-4 confirm-tutor-subtitle">
                {t('lesson_topic', { ns: 'lessons' })}
              </p>
              <div className="lesson_card-inline">
                <LessonCard
                  lesson={plan?.package?.course.title}
                  duration={`${plan?.package?.sessionTime} ${t('minutes', {
                    ns: 'common',
                  })}`}
                  remaining={t('lessons_remaining', {
                    ns: 'lessons',
                    count: plan?.credits,
                  })}
                />
              </div>
              <p className="welcome-subtitle pt-4 confirm-tutor-subtitle">
                {t('date_time', { ns: 'lessons' })}
              </p>
              <div className="mobile-width-subtitle">
                <ScheduleCard
                  startTime={scheduleStartTime}
                  endTime={scheduleEndTime}
                  date={scheduleDate}
                />
              </div>
              <p className="welcome-subtitle pt-4 confirm-tutor-subtitle">
                {t('mentor', { ns: 'lessons' })}
              </p>
              <div className="flex tutor-image">
                <TutorImageRow tutor={tutor} />
              </div>

              <div className="mt-3">
                <CheckboxField
                  label={t('repeating_lesson', { ns: 'translations' })}
                  onChange={(e) => setRepeat(e.target.checked)}
                  checked={repeat}
                />
              </div>

              {/* <p className='welcome-subtitle-fonts'>{t('repeating_lesson')}</p> */}
              {/* <div className='row container ps-2 mobile-view-align'>
                {repeatingLessonArr.map(x => (
                  <div className='col-auto schedule-lesson-border mobile-align-view ms-1 px-2 form-check-wrapper py-2'>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value={x.value}
                        id={x.data}
                        onChange={checkboxEvent}
                        checked={x.value === repeat?.value ? true : false}
                      />
                      <label className='form-check-label' htmlFor={x.data}>
                        {x.data}
                      </label>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
            {/* <div className='row container ps-2 set_padd_lesson'>
              {repeat.value === 4
                ? weekArr.map(x => (
                    <div className='col-auto schedule-lesson-border mobile-align-view ms-1 px-2 form-check-wrapper py-2'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          value={x}
                          id={x}
                          onChange={checkboxEvent}
                        />
                        <label className='form-check-label' htmlFor={x}>
                          {x}
                        </label>
                      </div>
                    </div>
                  ))
                : ''}
            </div> */}
            <div className="align_width_width">
              {/* <p className='welcome-subtitle-fonts'>
                {t('tutor_cancellation')}
              </p> */}
              {/* <div className='row container ps-2  mobile-view-align'>
                {cancellationArr.map((x, i) => (
                  <div
                    className='col-auto schedule-lesson-border mobile-align-view ms-1 px-2 form-check-wrapper py-2'
                    key={i}
                  >
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value={x.value}
                        id={x.data}
                        onChange={checkboxEvent}
                        checked={x.value === cancel?.value ? true : false}
                      />
                      <label className='form-check-label' htmlFor={x.data}>
                        {x.data}
                      </label>
                    </div>
                  </div>
                ))}
              </div> */}
            </div>
            <div className="align_width_width">
              <div className="d-grid gap-2 pt-3 buttons-Lesson-shape">
                <button
                  className={
                    confirmDisable
                      ? 'btn btn-primary text-white buttons-Lesson disB '
                      : 'btn btn-primary text-white buttons-Lesson'
                  }
                  onClick={confirmLesson}
                >
                  {confirmDisable
                    ? t('lesson_confirmation', { ns: 'lessons' })
                    : t('confirm_lesson', { ns: 'lessons' })}
                </button>
              </div>
            </div>
          </div>

          <div className="availability-wrapper  tutor-confirm-right flex-right-student-conf student-list-appointments-wrapper">
            {isConfirmed ? (
              <React.Fragment>
                <h4 className="weekly-schedule">
                  {t('lesson_confirmation', { ns: 'lessons' })}
                </h4>
                <h4 className="text-purple weekly-schedule-subtitle">
                  {t('lesson_confirmation_subtitle', { ns: 'lessons' })}
                </h4>
                <div className="flex-container gap-2 mb-4">
                  <div>
                    <Link
                      to="/student/manage-lessons"
                      className="enter-btn m-0"
                    >
                      {t('return_to_dash', { ns: 'lessons' })}
                    </Link>
                  </div>
                  <div>
                    <Link
                      to="/student/lesson-calendar"
                      className="enter-btn m-0"
                    >
                      {t('student_dashboard_view_all_lessons', {
                        ns: 'dashboard',
                      })}
                    </Link>
                  </div>
                </div>

                {newAppointment.map((appointment, index) => {
                  return (
                    <ScheduleCardComponent
                      key={index}
                      index={index}
                      lesson={
                        appointment?.packageSubscription?.package.course?.title
                      }
                      zoomlink={appointment?.zoomlink}
                      // date={time}
                      date={appointment?.startAt}
                      mentor={tutor}
                      data={appointment ?? {}}
                      subscription={plan}
                      fetchAppointments={fetchAppointments}
                      cancelled={cancelled}
                    />
                  );
                })}

                {/* <ScheduleCardComponent
                  index={0}
                  lesson={
                    newAppointment?.packageSubscription?.package.course?.title
                  }
                  zoomlink={newAppointment?.zoomlink}
                  date={time}
                  mentor={tutor}
                  data={newAppointment ?? {}}
                  subscription={plan}
                  fetchAppointments={fetchAppointments}
                  cancelled={cancelled}
                /> */}
              </React.Fragment>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
      {isLoading && <Loader />}
    </Layout>
  );
};

export default LessonConfirmation;
