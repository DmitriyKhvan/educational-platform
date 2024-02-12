import { Link } from 'react-router-dom';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ScheduleCard from '../../../components/student-dashboard/ScheduleCardRebranding';
import {
  addMinutes,
  endOfISOWeek,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
  startOfISOWeek,
} from 'date-fns';
import DashboardCard from './DashboardCard';
import { FaArrowRight } from 'react-icons/fa6';

const MyLessons = ({ appointments, fetchAppointments }) => {
  const [t] = useTranslation('dashboard');

  const scheduledAweekAppointments = useMemo(() => {
    const now = new Date();

    const startOfWeek = isAfter(now, startOfISOWeek(now))
      ? startOfDay(now)
      : startOfISOWeek(now);

    return appointments
      .filter((x, i, a) => {
        const expiredDate = addMinutes(new Date(x?.startAt), x?.duration || 0);

        return (
          isWithinInterval(new Date(x.startAt), {
            start: startOfWeek,
            end: endOfISOWeek(now),
          }) &&
          a.findIndex((y) => y.startAt === x.startAt) === i &&
          isBefore(new Date(), expiredDate)
        );
      })
      .sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
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
  }, [appointments]);

  return (
    <DashboardCard
      title={t('my_lessons', { ns: 'dashboard' })}
      subtitle={t('my_lessons_subtitle', { ns: 'dashboard' })}
      hrefTo="/student/lesson-calendar"
    >
      <div className="xl:hidden mt-[30px] lg:overflow-y-auto">
        {scheduledAweekAppointments && scheduledAweekAppointments[0]}
      </div>

      <div className="hidden xl:block mt-[30px] lg:overflow-y-auto">
        {scheduledAweekAppointments?.slice(0, 3)}
      </div>

      {scheduledAweekAppointments?.length > 3 && (
        <Link
          to="/student/lesson-calendar"
          className="hidden xl:flex w-full bg-color-purple bg-opacity-10 justify-center gap-1 items-center text-color-purple font-medium py-6 rounded-lg hover:opacity-80 mt-6"
        >
          All lessons ({scheduledAweekAppointments.length}){' '}
          <FaArrowRight className="w-4 h-4" />
        </Link>
      )}
    </DashboardCard>
  );
};

export default MyLessons;
