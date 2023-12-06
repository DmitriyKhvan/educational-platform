import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import moment from 'moment';
import ImgCalendar from '../../assets/images/calendar_icon.svg';
import ScheduleCard from '../../components/student-dashboard/ScheduleCard';
import Loader from '../../components/common/Loader';
import { useAuth } from '../../modules/auth';
import FeedbackLessonModal from './FeedbackLessonModal';
import { useQuery } from '@apollo/client';
import { APPOINTMENTS_QUERY } from '../../modules/auth/graphql';
import 'src/assets/styles/dashboard.scss';

const TutorDashboard = () => {
  const [t] = useTranslation('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [upcomingLessons, setUpcomingLessons] = useState([]);

  const { data: { lessons: appointments } = {}, refetch } = useQuery(
    APPOINTMENTS_QUERY,
    {
      variables: {
        mentorId: user?.mentor?.id,
        status: 'scheduled,paid,completed,in_progress,approved',
      },
    },
  );

  const tutor = user.tutor;

  const fetchAppointments = async () => {
    refetch();
    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      await fetchAppointments();
    })();
  }, [tutor]);

  useEffect(() => {
    if (appointments && appointments?.length > 0) {
      const startOfDay = new moment().startOf('day').subtract(1, 'minutes');
      const endOfDay = new moment().endOf('day');

      setUpcomingLessons(
        appointments?.filter((apt) => {
          return (
            new moment(apt.startAt).isBefore(endOfDay) &&
            new moment(apt.startAt).isAfter(startOfDay)
          );
        }),
      );
    }
  }, [appointments]);

  const displayDailySchedule = (availableLessons) => {
    if (availableLessons) {
      return availableLessons
        ?.sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
        .filter((lesson) => {
          const expiredDate = moment(lesson?.startAt).add(
            lesson?.duration,
            'minutes',
          );
          const currentDate = moment();
          return currentDate.isBefore(expiredDate);
        })
        .map((event, i) => {
          return (
            <ScheduleCard
              lesson={event?.packageSubscription?.package?.course?.title}
              duration={event?.duration}
              zoom={event?.zoom}
              date={event?.startAt}
              data={event}
              student={event.student}
              index={i}
              key={i}
              fetchAppointments={fetchAppointments}
            />
          );
        });
    }
  };

  const [isFeedbackShow, setFeedbackShow] = React.useState(false);

  const handleCloseModal = () => setFeedbackShow(false);

  return (
    <div className="main-dashboard overflow-auto h-full">
      <div className="flex-container">
        <div className="student-dashboard flex-left children-wrapper flex-change ">
          <div className="set-container">
            <h4 className="welcome-message">
              {t('student_dashboard_welcome', {
                name: user?.firstName,
              })}
            </h4>
            <p className="welcome-subtitle mt-[15px] mb-[10px] xl:mt-[30px] xl:mb-[20px]">
              {t('mentor_welcome_back')}
            </p>

            <div className="schedule-lesson-select pt-3">
              <div className="page-card bg-color-purple large-card py-5 flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="max-w-32 max-h-fit m-auto">
                    <img
                      src={ImgCalendar}
                      alt=""
                      className="img-fluid large-card-icon self-center"
                    />
                  </div>
                  <div className="w-full">
                    <div className="titles_align_desktop">
                      <p className="titles mt-1  laptop-title mobile_align_dash">
                        {t('review_my_schedule')}
                      </p>
                    </div>
                    <div className="row mobile-view-buttons mt-4">
                      <div className="col-6 desktop schedule-dashboard-button">
                        <Link
                          to="/mentor/lesson-calendar"
                          className="enter-btn dashboard_cal-scl_button"
                        >
                          {t('calendar')}
                        </Link>
                      </div>
                      <div className="col-6 schedule-dashboard-button">
                        <Link
                          to="/mentor/availability"
                          className="enter-btn dashboard_cal-scl_button"
                        >
                          {t('availability')}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="student-list-appointments-wrapper flex-right  changes-container">
          <div className="child-set_container">
            {/* {displayBookingRequest(hasLessonApprovals)} */}
            <h4 className="weekly-schedule mt-4">{t('daily_schedule')}</h4>
            <h4 className="text-purple weekly-schedule-subtitle">
              {t('upcoming_lessons')}
            </h4>
            {t('mentor_dashboard_total_lessons', {
              total_lessons: upcomingLessons.length,
              t: upcomingLessons.length > 1 ? 's' : '',
            })}
            <Link
              to="/mentor/lesson-calendar"
              className="enter-btn ms-0 tutor_cal_appoint"
            >
              {t('student_dashboard_view_all_lessons')}
            </Link>
            <div className="weekly-schedule-scroll">
              {displayDailySchedule(upcomingLessons)}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loader />}

      <FeedbackLessonModal
        modalState="mentor"
        isOpen={isFeedbackShow}
        closeModal={handleCloseModal}
      />
    </div>
  );
};

export default TutorDashboard;
