import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import NotificationManager from '../../../components/NotificationManager';
import Layout from '../../../layouts/DashboardLayout';
import ScheduleCard from './ScheduleCard';
import ScheduleCardComponent from '../../../components/student-dashboard/ScheduleCard';
import Loader from '../../../components/common/Loader';
import { useAuth } from '../../../modules/auth';
import LessonCard from './LessonCard';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  APPOINTMENTS_QUERY,
  CREATE_APPOINTMENT,
  UPDATE_APPOINTMENT,
} from '../../../modules/auth/graphql';

import CheckboxField from '../../../components/Form/CheckboxField';
import {
  getItemToLocalStorage,
  LessonsStatusType,
  WEEKS_IN_MONTH,
} from 'src/constants/global';
import Button from 'src/components/Form/Button';
import MentorImageRow from './MentorImageRow';
import { useCourseTranslation } from 'src/utils/useCourseTranslation';
import { utcToZonedTime, format } from 'date-fns-tz';
import { addMinutes } from 'date-fns';

const LessonConfirmation = ({
  plan,
  tutor,
  time,
  setTabIndex,
  lessonId = null,
  isMentorScheduled = false,
}) => {
  const { getTitleByCourseId } = useCourseTranslation();
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

  const [credits, setCredits] = useState(plan?.credits);
  const [canceledLessons, setCanceledLessons] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [newAppointment, setNewAppointment] = useState([]);

  const [isConfirmed, setIsConfirmed] = useState(false);
  // const [, setDate] = useState();
  const [confirmDisable, setConfirmDisable] = useState(false);
  const [getAppointments] = useLazyQuery(APPOINTMENTS_QUERY, {
    variables: {
      // studentId: user?.students[0]?.id,
      studentId: getItemToLocalStorage('studentId'),
      status: 'scheduled',
    },
    fetchPolicy: 'network-only',
  });
  const [createAppointment] = useMutation(CREATE_APPOINTMENT);
  const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);

  const fetchAppointments = async () => {
    return (await getAppointments()).data;
  };
  const history = useHistory();

  useEffect(() => {
    // leave only scheduled lessons
    if (canceledLessons) {
      const appointments = newAppointment.filter(
        (appointment) =>
          !canceledLessons.some((lesson) => lesson.id === appointment.id),
      );
      setNewAppointment(appointments);

      // remaining credits
      setCredits((prev) => prev + canceledLessons.length);
    }
  }, [canceledLessons]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // const cancelled = async () => {
  //   setIsConfirmed(false);
  //   setNewAppointment([]);
  // };

  const userTimezone =
    user?.timeZone?.split(' ')[0] ||
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  const scheduleDate = format(
    utcToZonedTime(new Date(time), userTimezone),
    'eeee, MMM dd',
  );
  const scheduleStartTime = format(
    utcToZonedTime(new Date(time), userTimezone),
    'hh:mm a',
  );
  const scheduleEndTime = format(
    addMinutes(
      utcToZonedTime(new Date(time), userTimezone),
      plan?.package?.sessionTime,
    ),
    'hh:mm a',
  );

  const utcIsoTimeString = new Date(time).toISOString();

  const confirmLesson = async () => {
    setIsLoading(true);

    /* this means if the lesson ID exists, its going to be a reschedule */
    let lesson = [];
    if (lessonId) {
      setIsLoading(true);
      const { data: { lesson: updatedLesson } = {} } = await updateAppointment({
        variables: {
          id: lessonId,
          mentorId: tutor.id,
          startAt: utcIsoTimeString,
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
              // studentId: user.students[0].id,
              studentId: getItemToLocalStorage('studentId'),
              subscriptionId: plan?.id,
              startAt: utcIsoTimeString,
              duration: plan?.package?.sessionTime,
              repeat: repeat,
            },
          });

        const scheduledLessons = createdLesson.filter(
          (lesson) => lesson.status === LessonsStatusType.SCHEDULED,
        );
        setCredits(credits - scheduledLessons.length);

        lesson = createdLesson;
      } catch (error) {
        NotificationManager.error(error.message, t);
      } finally {
        setIsLoading(false);
      }
    }

    if (lesson.length) {
      setConfirmDisable(true);
      setNewAppointment(lesson);
      // setDate(moment(lesson.startAt).unix());

      if (lesson.length === 1 && lesson[0].cancelReason) {
        setIsConfirmed(false);
      } else {
        setIsConfirmed(true);
      }
      window.scrollTo(0, 0);
    }
    setIsLoading(false);
  };

  const timeRepeatLesson =
    plan.credits < plan.package.sessionsPerWeek * WEEKS_IN_MONTH
      ? Math.ceil(plan.credits / plan.package.sessionsPerWeek)
      : WEEKS_IN_MONTH;

  const repeatLesson = `
    ${t('repeat_lesson', { ns: 'lessons' })} 
    ${t(format(new Date(time), 'eee'), {
    ns: 'translations',
  })} ${timeRepeatLesson}x
    (${t('max_month', { ns: 'lessons' })})
  `;

  return (
    <Layout>
      <div className="flex flex-wrap lg:flex-nowrap h-full">
        <div className="grow py-[30px] xl:py-[50px] px-[30px] xl:px-[65px]">
          <h1 className="my-2 mt-0">{t('confirmation', { ns: 'lessons' })}</h1>
          <p className="welcome-subtitle text-xl mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px]">
            {t('confirmation_subtitle', { ns: 'lessons' })}
          </p>
          <div className="flex flex-wrap gap-2 lg:gap-3 ">
            <Button
              className="px-[10px] h-10"
              theme="outline"
              onClick={() => setTabIndex(0)}
            >
              {t('edit_lesson', { ns: 'lessons' })}
            </Button>

            <Button
              className="px-[10px] h-10"
              theme="outline"
              onClick={() => setTabIndex(1)}
            >
              {t('edit_schedule', { ns: 'lessons' })}
            </Button>

            <Button
              className="px-[10px] h-10"
              theme="outline"
              onClick={() =>
                isMentorScheduled
                  ? history.push('/student/mentors-list')
                  : setTabIndex(2)
              }
            >
              {t('edit_mentor', { ns: 'lessons' })}
            </Button>
          </div>

          <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px] text-xl">
            {t('lesson_topic', { ns: 'lessons' })}
          </p>
          <div className="flex">
            <LessonCard
              lesson={getTitleByCourseId(plan?.package?.course.id)}
              duration={`${plan?.package?.sessionTime} ${t('minutes', {
                ns: 'common',
              })}`}
              remaining={t('lessons_remaining', {
                ns: 'lessons',
                // count: plan?.credits,
                count: credits,
              })}
            />
          </div>
          <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px] text-xl">
            {t('date_time', { ns: 'lessons' })}
          </p>
          <div className="flex">
            <ScheduleCard
              startTime={scheduleStartTime}
              endTime={scheduleEndTime}
              date={scheduleDate}
            />
          </div>
          <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px] text-xl">
            {t('mentor', { ns: 'lessons' })}
          </p>
          <div className="flex">
            <MentorImageRow mentor={tutor} />
          </div>

          <div className="mt-3">
            <CheckboxField
              label={repeatLesson}
              onChange={(e) => setRepeat(e.target.checked)}
              checked={repeat}
            />
          </div>

          <Button
            className="w-full text-xl h-auto p-[18px] mt-10"
            disabled={confirmDisable}
            theme="purple"
            onClick={confirmLesson}
          >
            {confirmDisable && isConfirmed
              ? t('lesson_pending_approval', { ns: 'lessons' })
              : confirmDisable && !isConfirmed
                ? t('lesson_scheduling_failed', { ns: 'lessons' })
                : t('booking_lesson', { ns: 'lessons' })}
          </Button>
        </div>

        <div className="grow lg:w-[50%] xl:w-[40%] px-[30px] py-[30px] xl:py-[50px] border-t lg:border-l lg:border-t-0  border-color-border-grey">
          {newAppointment.length > 0 ? (
            <React.Fragment>
              {isConfirmed && (
                <>
                  <h4 className="text-purple font-normal text-[clamp(1rem,_5vw,_2rem)]">
                    {t('lesson_pending_approval', { ns: 'lessons' })}
                  </h4>
                  <h4 className="text-color-light-grey my-[15px] sm:my-[30px] text-[clamp(0.5rem,_4vw,_1rem)]">
                    {t('lesson_pending_approval_subtitle', { ns: 'lessons' })}
                  </h4>
                </>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                <div>
                  <Link to="/student/manage-lessons" className="enter-btn m-0">
                    {t('return_to_dash', { ns: 'lessons' })}
                  </Link>
                </div>
                <div>
                  <Link to="/student/lesson-calendar" className="enter-btn m-0">
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
                      getTitleByCourseId(
                        appointment?.packageSubscription?.package.course?.id,
                      ) ??
                      appointment?.packageSubscription?.package.course?.title
                    }
                    // date={time}
                    date={appointment?.startAt}
                    mentor={tutor}
                    data={appointment ?? {}}
                    subscription={plan}
                    fetchAppointments={fetchAppointments}
                    // cancelled={cancelled}
                    setCanceledLessons={setCanceledLessons}
                  />
                );
              })}

              {/* <ScheduleCardComponent
                  index={0}
                  lesson={
                    newAppointment?.packageSubscription?.package.course?.title
                  }
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
      {isLoading && <Loader />}
    </Layout>
  );
};

export default LessonConfirmation;
