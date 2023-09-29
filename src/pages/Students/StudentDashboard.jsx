import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
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
import toast from 'react-hot-toast';
import {
  addMinutes,
  endOfISOWeek,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
  startOfISOWeek,
} from 'date-fns';

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
  const [cancelAppointment] = useMutation(CANCEL_APPOINTMENT, {
    onError: (e) => {
      NotificationManager.error(e?.message || "Couldn't cancel this lesson", t);
    },
    onCompleted: () => {
      toast.success('Your lesson has been cancelled successfully');
    },
  });

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
      NotificationManager.error(e?.message || 'Server Issue', t);
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

  //Lessons within one week
  const isWithinAweekArr = (appointments = []) => {
    const now = new Date();

    const startOfWeek = isAfter(now, startOfISOWeek(now))
      ? startOfDay(now)
      : startOfISOWeek(now);

    return appointments.filter((x) =>
      isWithinInterval(new Date(x.startAt), {
        start: startOfWeek,
        end: endOfISOWeek(now),
      }),
    );
  };

  //leave only unique lessons by date ==========================================
  const isWithinAweek = isWithinAweekArr(appointments).filter(
    (x, i, a) => a.findIndex((y) => y.startAt === x.startAt) === i,
  );
  //================================================================

  const ScheduleArr = (isWithinAweek || [])
    .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
    .filter((lesson) => {
      const expiredDate = addMinutes(
        new Date(lesson?.startAt),
        lesson?.duration || 0,
      );
      return isBefore(new Date(), expiredDate);
    })
    .map((x, i) => {
      const date = new Date(x?.startAt);

      return (
        <div key={i}>
          <ScheduleCard
            duration={x.duration}
            lesson={x?.packageSubscription?.package?.course?.title}
            mentor={x.mentor}
            zoom={x?.zoom}
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
        bgIcon: '#A60B00',
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
        bgIcon: '#040EB7',
      },
    ];
  }

  return (
    <Layout>
      <div className="relative h-full">
        <div className="flex flex-wrap 2xl:flex-nowrap">
          <div className="w-full px-[22px] pt-5 lg:pt-[30px] lg:px-[35px] xl:w-3/5 2xl:w-[65%] 2xl:pt-[50px] 2xl:px-[65px]">
            <div>
              <h4 className="text-[30px] font-semibold tracking-tight mb-2.5">
                {t('student_dashboard_welcome', {
                  ns: 'dashboard',
                  name: user.firstName,
                })}
              </h4>
              <p className="text-[17px] text-color-light-grey font-semibold tracking-tight mb-[50px]">
                {t('student_dashboard_subtitle', { ns: 'dashboard' })}
              </p>
              <div className="border rounded-[10px] bg-color-purple p-[30px]">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-4 items-center sm:items-start sm:flex-row">
                    <div className="min-w-[65px] w-[65px] h-[65px] rounded-lg bg-[#04005f] flex items-center justify-center">
                      <img src={ImgCalendar} alt="calendar" />
                    </div>
                    <p className="text-[30px] font-semibold tracking-tight text-white leading-normal">
                      {t('schedule_card', { ns: 'dashboard' })}
                    </p>
                  </div>
                  <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-[30px] md:w-11/12">
                    <Link
                      to="/student/schedule-lesson/select"
                      className="rounded bg-white p-3.5 text-[#261A45] font-semibold text-[15px] leading-normal flex-grow text-center flex justify-center items-center"
                    >
                      {t('schedule_by_time', { ns: 'dashboard' })}
                    </Link>
                    <Link
                      to="/student/mentors-list"
                      className="rounded bg-white p-3.5 text-[#261A45] font-semibold text-[15px] leading-normal flex-grow text-center flex justify-center items-center"
                    >
                      {t('schedule_by_mentor', { ns: 'dashboard' })}
                    </Link>
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
            <div className="mt-[50px]">
              <h4 className="text-[30px] font-semibold tracking-tight mb-[30px]">
                {t('already_lesson', { ns: 'dashboard' })}
              </h4>
              <div className="flex gap-4 md:gap-[30px] justify-between">
                {loading ? (
                  <Loader />
                ) : (
                  callToAction.map((props, i) => <CTACard key={i} {...props} />)
                )}
              </div>
            </div>
          </div>
          <div className="w-full px-[22px] lg:pt-[30px] 2xl:pt-[50px] 2xl:pl-[30px] border-t mt-8 xl:mt-0 xl:w-2/5 xl:border-none 2xl:w-[35%] bg-[#F7F7FA]">
            {!isLoading && (
              <div className="mt-4">
                <h4 className="text-[30px] tracking-tight font-normal mb-2.5">
                  {t('weekly_schedule', { ns: 'dashboard' })}
                </h4>
                <div className="text-[#7048E8] text-[17px] font-semibold">
                  {t('student_dashboard_total_lessons', {
                    ns: 'dashboard',
                    total_lessons: isWithinAweek?.length || 0,
                    t: isWithinAweek?.length > 1 ? 's' : '',
                  })}
                </div>
                <div className="mt-5">
                  <section className="flex flex-row gap-2.5">
                    <Link
                      to="/student/schedule-lesson/select"
                      className="inline-block p-4 rounded-[5px] bg-white text-[15px] font-semibold text-color-dark-violet shadow-[0_4px_10px_0px_rgba(0,0,0,0.07)]"
                    >
                      {t('student_dashboard_edit_schedule', {
                        ns: 'dashboard',
                      })}
                    </Link>
                    <Link
                      to="/student/lesson-calendar"
                      className="inline-block p-4 rounded-[5px] bg-white text-[15px] font-semibold text-color-dark-violet shadow-[0_4px_10px_0px_rgba(0,0,0,0.07)]"
                    >
                      {t('student_dashboard_view_all_lessons', {
                        ns: 'dashboard',
                      })}
                    </Link>
                  </section>
                </div>

                <div className="mt-[30px] h-[65vh] overflow-y-auto scroll-hidden">
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
