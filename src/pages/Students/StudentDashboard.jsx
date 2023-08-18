import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import Layout from '../../components/Layout';
import '../../assets/styles/student.scss';
import { Link, useParams, useHistory } from 'react-router-dom';
import { ModalCancelLesson } from '../../components/ModalCancelLesson';
import { useTranslation } from 'react-i18next';
import { cancel_lesson_reasons_student } from '../../constants/global';
import ImgCalendar from '../../assets/images/calendar_icon.svg';
import NotificationManager from '../../components/NotificationManager';
import ModalFeedback from './ModalFeedback';
import CTACard from '../../components/student-dashboard/CTACard';
import ScheduleCard from '../../components/student-dashboard/ScheduleCard';
import whiteBookingIcon from '../../assets/images/white_book_trial_icon.svg';
import calendarIconMain from '../../assets/images/calendar_icon_main.svg';
import smileIcon from '../../assets/images/smile_icon.svg';
import { useAuth } from '../../modules/auth';
import {
  CANCEL_APPOINTMENT,
  APPOINTMENTS_QUERY,
  PACKAGE_QUERY,
} from '../../modules/auth/graphql';
import { useQuery, useMutation } from '@apollo/client';
import Loader from '../../components/Loader/Loader';

const options = [
  { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
  { value: 'completed_lesson', label: 'Completed Lessons' },
];

const StudentListAppointments = () => {
  const { complete_appoint_id } = useParams();
  const [t] = useTranslation('dashboard');
  const [selectedOption] = useState(options[0]);
  const [selectedLesson, setSelectedLesson] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { data: { lessons: appointments } = {}, refetch } = useQuery(
    APPOINTMENTS_QUERY,
    {
      variables: {
        status: 'scheduled,paid,completed,in_progress,approved',
        studentId: user?.students[0]?.id,
      },
    },
  );
  const [completedAppointment, setCompleteAppointment] = useState(null);
  const history = useHistory();
  const onDismiss = () => setCompleteAppointment(null);
  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT);

  const onCancel = async ({ id }) => {
    setIsLoading(true);
    try {
      await cancelAppointment({
        variables: {
          id: parseInt(id),
        },
      });
      await fetchAppointments();
    } catch (e) {
      NotificationManager.error(e.response?.data?.message || 'Server Issue', t);
    }
    setSelectedLesson(false);
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (user.tutor_profile) {
        history.push('/');
      }
      if (user) {
        await fetchAppointments();
      }
    })();
  }, [selectedOption, user]);

  useEffect(() => {
    if (complete_appoint_id) {
      const feedbackAppt = appointments?.find(
        (apt) => apt.id == complete_appoint_id,
      );
      setCompleteAppointment(feedbackAppt);
    }
  }, [appointments, complete_appoint_id]);

  const fetchAppointments = async () => {
    refetch();
    setIsLoading(false);
  };

  const isWithinAweekArr = (appointments || [])
    .map((x) => {
      const startOfWeek = moment().isAfter(moment().startOf('isoWeek'))
        ? moment().startOf('day')
        : moment().startOf('isoWeek');

      if (moment(x.startAt).isBetween(startOfWeek, moment().endOf('isoWeek'))) {
        return x;
      }
    })
    .filter((x) => x);

  //What is this code for ==========================================
  const isWithinAweek = isWithinAweekArr.filter(
    (x, i, a) => a.findIndex((y) => y.startAt === x.startAt) === i,
  );
  //================================================================

  const ScheduleArr = (isWithinAweek || [])
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    .filter((lesson) => {
      const expiredDate = moment(lesson?.startAt).add(
        lesson?.duration,
        'minutes',
      );
      const currentDate = moment();
      return currentDate.isBefore(expiredDate);
    })
    .map((x, i) => {
      const date = moment(x?.startAt);

      return (
        <div key={i}>
          <ScheduleCard
            duration={x.duration}
            lesson={x?.packageSubscription?.package?.course?.title}
            mentor={x.mentor}
            zoomlinkId={x?.zoomlinkId}
            date={date}
            data={x}
            index={i}
            fetchAppointments={fetchAppointments}
          />
        </div>
      );
    });

  const { data: packageInfo, loading } = useQuery(PACKAGE_QUERY, {
    variables: {
      userId: user.id,
    },
  });

  let callToAction = [];

  if (packageInfo?.packageSubscriptions.length === 0) {
    callToAction = [
      {
        icon: smileIcon,
        title: t('student_dashboard_feedback', { ns: 'dashboard' }),
        disabled: true,
        button: {
          to: '',
          text: t('student_dashboard_submit_feedback_btn', {
            ns: 'dashboard',
          }),
        },
        color: '#D6336C',
        cl: '',
      },
      {
        icon: calendarIconMain,
        title: t('student_dashboard_no_package', { ns: 'dashboard' }),
        bl: 'secblock',
        button: {
          to: '/purchase',
          text: t('student_dashboard_no_package_desc', { ns: 'dashboard' }),
        },
        color: '#1482DA',
        cl: 'blue-progress',
      },
    ];
  } else {
    callToAction = [
      {
        icon: smileIcon,
        title: t('student_dashboard_feedback', { ns: 'dashboard' }),
        disabled: true,
        button: {
          to: '',
          text: t('student_dashboard_submit_feedback_btn', {
            ns: 'dashboard',
          }),
        },
        color: '#D6336C',
        cl: '',
      },
      {
        icon: whiteBookingIcon,
        title: t('student_dashboard_progress', { ns: 'dashboard' }),
        bl: 'secblock',
        button: {
          to: '/student/lesson-calendar?completed',
          text: t('completed_lessons', { ns: 'dashboard' }),
        },
        color: '#1482DA',
        cl: 'blue-progress',
      },
    ];
  }

  return (
    <Layout>
      <div className="main-dashboard">
        <div className="flex-container">
          <div className="student-dashboard flex-left children-wrapper flex-change childern-padding">
            <div className="set-container">
              <h4 className="welcome-message">
                {t('student_dashboard_welcome', {
                  ns: 'dashboard',
                  name: user.firstName,
                })}
              </h4>
              <p className="welcome-subtitle">
                {t('student_dashboard_subtitle', { ns: 'dashboard' })}
              </p>
              <div className="schedule-lesson-select pt-3">
                <div className="page-card purple large-card py-5 flex flex-col gap-4">
                  <div className="flex gap-4">
                    <div className="min-w-[4rem] max-h-fit m-auto">
                      <img
                        src={ImgCalendar}
                        alt=""
                        className="img-fluid large-card-icon self-center"
                      />
                    </div>
                    <p className="title mt-1 laptop-title mobile_dash">
                      {t('schedule_card', { ns: 'dashboard' })}
                    </p>
                  </div>
                  <div>
                    <div
                      className="desktop schedule-dashboard-button flex justify-center items-center"
                      style={{
                        width: '100%',
                      }}
                    >
                      <Link
                        to="/student/schedule-lesson/select"
                        className="schedule-dashboard-buttons"
                      >
                        {t('schedule_by_time', { ns: 'dashboard' })}
                      </Link>
                      <Link
                        to="/student/mentors-list"
                        className="schedule-dashboard-buttons"
                      >
                        {t('schedule_by_mentor', { ns: 'dashboard' })}
                      </Link>
                    </div>
                    {/* <div className='col-6 schedule-dashboard-button'>
                        <Link
                          to='/student/schedule-lesson/group-select'
                          className='schedule-dashboard-buttons'
                        >
                          {t('schedule_group_lesson')}
                        </Link>
                      </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5">
              <div className="cards-container">
                <h4 className="welcome-message">
                  {t('already_lesson', { ns: 'dashboard' })}
                </h4>
                <div className="flex gap-4 justify-between mt-5 cards">
                  {loading ? (
                    <Loader />
                  ) : (
                    callToAction.map((props, i) => (
                      <CTACard key={i} {...props} />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="student-list-appointments-wrapper flex-right changes-container">
            {!isLoading && (
              <div className="child-set_container dash_child-set_container ">
                <h4 className="weekly-schedule">
                  {t('weekly_schedule', { ns: 'dashboard' })}
                </h4>
                <div className="weekly-schedule-subtitle dash_weekly-schedule-subtitle">
                  {t('student_dashboard_total_lessons', {
                    ns: 'dashboard',
                    total_lessons: isWithinAweek?.length || 0,
                    t: isWithinAweek?.length > 1 ? 's' : '',
                  })}
                </div>
                <div>
                  <section className="d-flex gap-2 align-button-dashboard">
                    <div>
                      <Link
                        to="/student/schedule-lesson/select"
                        className="buttonsdash"
                      >
                        {t('student_dashboard_edit_schedule', {
                          ns: 'dashboard',
                        })}
                      </Link>
                    </div>
                    <div>
                      <Link
                        to="/student/lesson-calendar"
                        className="buttonsdash-second"
                      >
                        {t('student_dashboard_view_all_lessons', {
                          ns: 'dashboard',
                        })}
                      </Link>
                    </div>
                  </section>
                </div>

                <div className="weekly-schedule-scroll align_schedule-width-dash weekly-schedule-grid">
                  {appointments?.length ? <>{ScheduleArr}</> : ''}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* // : (
        //   <div className="d-flex flex-column min-vh-80 justify-content-center align-items-center">
        //     <img src={emptyCalendar} alt="" className="img-fluid" />
        //     <div>
        //       <h1>{t('student_dashboard_no_lessons', { ns: 'dashboard' })}</h1>
        //     </div>
        //     <h3 className="mt-0">
        //       {t('student_dashboard_no_lessons_subtitle', { ns: 'dashboard' })}
        //     </h3>
        //     <div className="row  justify-content-center mt-5">
        //       {callToAction.map((props, i) => (
        //         <div key={i} className="col-4">
        //           <CTACard {...props} />
        //         </div>
        //       ))}
        //     </div>
        //   </div>
        // ) */}
      </div>
      {selectedLesson && (
        <ModalCancelLesson
          visible={!!selectedLesson}
          lesson={selectedLesson}
          onDismiss={onDismiss}
          onCancel={onCancel}
          reasons={cancel_lesson_reasons_student}
        />
      )}
      {completedAppointment && (
        <ModalFeedback
          onDismiss={() => {
            fetchAppointments();
            onDismiss();
          }}
          visible={true}
          appointment={completedAppointment}
        />
      )}
    </Layout>
  );
};
export default StudentListAppointments;
