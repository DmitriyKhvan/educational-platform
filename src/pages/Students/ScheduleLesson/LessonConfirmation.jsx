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
import { APPOINTMENTS_QUERY, CREATE_APPOINTMENT, UPDATE_APPOINTMENT } from '../../../modules/auth/graphql';

const LessonConfirmation = ({
  plan,
  tutor,
  time,
  setTabIndex,
  lessonId = null,
  isMentorScheduled = false,
}) => {
  const [t] = useTranslation(['common', 'lessons', 'dashboard']);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [newAppointment, setNewAppointment] = useState({});
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [, setDate] = useState();
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [getAppointments] = useLazyQuery(APPOINTMENTS_QUERY);
  const [createAppointment] = useMutation(CREATE_APPOINTMENT);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

  const fetchAppointments = async () => {
    return (await getAppointments()).data;
  };
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cancelled = async () => {
    const { payload } = await (
      await getAppointments({
        variables: {
          studentId: user?.students[0]?.id,
          status: 'scheduled,paid,completed,in_progress',
        },
      })
    ).data;
    if (!payload.find((appointment) => appointment.id === newAppointment.id)) {
      setIsConfirmed(false);
      setNewAppointment({});
    }
  };

  const men = {
    avatar: {
      url: tutor?.avatar,
    },
  };

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;
  const scheduleDate = moment(time).tz(userTimezone).format('dddd, MMM DD');

  const scheduleStartTime = moment(time).tz(userTimezone).format('hh:mm A');
  const scheduleEndTime = moment(time)
    .tz(userTimezone)
    .add(plan?.duration, 'minutes')
    .format('hh:mm A');

  let data = {
    lesson_title: plan?.lesson_title,
    lesson_desc: plan?.description,
    lesson_type: plan?.lesson_type,
    type: plan?.type,
    lesson_id: plan?.lesson_id,
    tutor_id: tutor?.id,
    duration: plan?.duration,
    start_at: moment
      .utc(time, 'ddd MMM DD YYYY HH:mm:ssZ')
      .format('YYYY-MM-DDTHH:mm:ss'),
    cancel_action: 'assign_new_tutor',
  };
  // if (user.student_profile.id) {
  //   // data = { ...data, student_id: user.student_profile.id }
  // }
  data = { ...data, student_id: 26 };

  const confirmLesson = async () => {
    setIsLoading(true);

    /* this means if the lesson ID exists, its going to be a reschedule */
    if (lessonId) {
      setIsLoading(true);
      const res = await updateAppointment({
        variables: {
          id: lessonId,
          mentorId: data?.tutor_id,
          startAt: data?.start_at,
        }
      })
      setIsLoading(false);

      if (res) {
        const { payload } = await (
          await {
            variables: {
              mentorId: data?.tutor_id,
              status: 'scheduled,paid,completed,in_progress',
            },
          }
        ).data;
        setConfirmDisable(true);
        const newAppt = payload.filter((x) => x.id === parseInt(lessonId))[0];

        if (newAppt) {
          setNewAppointment(newAppt);
          setDate(moment(res.payload?.group?.start_at).unix());
          setIsConfirmed(true);
          window.scrollTo(0, 0);
        }
      } else {
        if (res.payload.error.messages && res.payload.error.messages.length) {
          NotificationManager.error(
            res.payload.error.messages.map((msg) => msg.title).join('\n'),
            t,
          );
        } else if (res.payload.error.message) {
          NotificationManager.error(res.payload.error.message, t);
        } else {
          NotificationManager.error('Server Error', t);
        }
        setIsLoading(false);
      }
    } else {

      const res = await createAppointment({
        variables: {
          mentorId: data.tutor_id,
          studentId: user.students[0].id,
          courseId: plan?.course_id,
          packageId: plan?.package_id,
          startAt: data.start_at,
          duration: data.duration,
        }
      });

      if (res) {
        const { payload } = await fetchAppointments();
        const newAppt = payload?.filter(
          (x) => x?.id === parseInt(res.payload?.groups[0].id),
        )[0];
        if (newAppt) {
          setConfirmDisable(true);
          setNewAppointment(newAppt);
          setDate(moment(newAppt.start_at).unix());
          setIsConfirmed(true);
          window.scrollTo(0, 0);
        }
      } else {
        if (res.payload.error.messages && res.payload.error.messages.length) {
          NotificationManager.error(
            res.payload.error.messages.map((msg) => msg.title).join('\n'),
            t,
          );
        } else if (res.payload.error.message) {
          NotificationManager.error(res.payload.error.message, t);
        } else {
          NotificationManager.error('Server Error', t);
        }
        setIsLoading(false);
      }
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
              <div className="row ">
                <div className="col-auto button-size">
                  <button
                    className="confirm-tutor-enter-btn mobile-width"
                    onClick={() => setTabIndex(0)}
                  >
                    {t('edit_lesson', { ns: 'lessons' })}
                  </button>
                </div>
                <div className="col-auto button-size">
                  <button
                    className="confirm-tutor-enter-btn mobile-width"
                    onClick={() => setTabIndex(1)}
                  >
                    {t('edit_schedule', { ns: 'lessons' })}
                  </button>
                </div>
                <div className="col-auto button-size">
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
                  lesson={plan?.lesson_type}
                  duration={`${plan?.duration} ${t('minutes', {
                    ns: 'common',
                  })}`}
                  remaining={t('lessons_remaining', {
                    ns: 'lessons',
                    count: plan?.total_lessons,
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
              <div className="row ps-2 tutor-image">
                <TutorImageRow tutor={tutor} />
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
                <div className="flex-container">
                  <div>
                    <Link to="/student/manage-lessons" className="enter-btn">
                      {t('return_to_dash', { ns: 'lessons' })}
                    </Link>
                  </div>
                  <div>
                    <Link to="/student/lesson-calendar" className="enter-btn">
                      {t('student_dashboard_view_all_lessons', {
                        ns: 'dashboard',
                      })}
                    </Link>
                  </div>
                </div>
                <ScheduleCardComponent
                  index={0}
                  lesson={newAppointment.lesson.description}
                  zoomlink={newAppointment.zoomlink}
                  date={time}
                  mentors={men}
                  data={newAppointment}
                  fetchAppointments={fetchAppointments}
                  cancelled={cancelled}
                />
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
