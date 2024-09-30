import { useAuth } from '@/app/providers/auth-provider';
import Loader from '@/components/common/loader';
import { APPOINTMENTS_QUERY } from '@/shared/apollo/graphql';
import ImgCalendar from '@/shared/assets/images/calendar_icon.svg';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import '@/app/styles/dashboard.scss';
import LevelAfterTrialModal from '@/pages/mentors/level-after-trial-modal';
import type { Lesson } from '@/types/types.generated';
import '@/app/styles/dashboard.scss';
import {
  addMinutes,
  endOfDay,
  isAfter,
  isBefore,
  parseISO,
  startOfDay,
  subMinutes,
} from 'date-fns';
import ScheduleCard from '@/components/student-dashboard/schedule-card-rebranding';

const MentorDashboard = () => {
  const [t] = useTranslation('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [upcomingLessons, setUpcomingLessons] = useState<Lesson[]>();

  const {
    data: { lessons: appointments } = {},
    refetch,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      mentorId: user?.mentor?.id,
      status: 'scheduled,paid,completed,in_progress,approved',
    },
    fetchPolicy: 'network-only',
  });

  const fetchAppointments = async () => {
    refetch();
    setIsLoading(false);
  };

  useEffect(() => {
    if (appointments && appointments?.length > 0) {
      const dayStart = subMinutes(startOfDay(new Date()), 1);
      const dayEnd = endOfDay(new Date());

      setUpcomingLessons(
        appointments
          ?.filter((apt) => {
            const expiredDate = addMinutes(parseISO(apt?.startAt), apt?.duration);
            return (
              isBefore(parseISO(apt.startAt), dayEnd) &&
              isAfter(parseISO(apt.startAt), dayStart) &&
              isBefore(new Date(), expiredDate)
            );
          })
          .sort((a, b) => new Date(a.startAt) - new Date(b.startAt)),
      );
    }
  }, [appointments]);

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
                      <div className="col-6 desktop w-full">
                        <Link
                          to="/mentor/lesson-calendar"
                          className="enter-btn dashboard_cal-scl_button"
                        >
                          {t('calendar')}
                        </Link>
                      </div>
                      <div className="col-6 w-full">
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
        <div className="student-list-appointments-wrapper flex-right pt-5">
          <div className="child-set_container">
            {/* {displayBookingRequest(hasLessonApprovals)} */}
            <h4 className="weekly-schedule mt-4">{t('daily_schedule')}</h4>
            <h4 className="text-purple weekly-schedule-subtitle">{t('upcoming_lessons')}</h4>
            {t('mentor_dashboard_total_lessons', {
              total_lessons: upcomingLessons?.length,
              t: upcomingLessons?.length ?? 0 > 1 ? 's' : '',
            })}
            <Link to="/mentor/lesson-calendar" className="enter-btn ms-0 p-3">
              {t('student_dashboard_view_all_lessons')}
            </Link>
            <div className="weekly-schedule-scroll">
              {/* {displayDailySchedule(upcomingLessons)} */}
              {upcomingLessons?.map((event, i) => (
                <ScheduleCard
                  lesson={event?.packageSubscription?.package?.course?.title}
                  duration={event?.duration}
                  playground={event?.playground}
                  date={event?.startAt}
                  data={event}
                  student={event.student}
                  index={i}
                  key={i}
                  fetchAppointments={fetchAppointments}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <Loader />}

      <LevelAfterTrialModal />
    </div>
  );
};

export default MentorDashboard;
