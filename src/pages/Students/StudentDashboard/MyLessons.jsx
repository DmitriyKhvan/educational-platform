import React, { useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
import { useMediaQuery } from 'react-responsive';
import Button from 'src/components/Form/Button';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';

const MyLessons = ({
  appointments,
  packageSubscriptions,
  fetchAppointments,
}) => {
  const navigate = useHistory();
  const isDesktop = useMediaQuery({ minWidth: 1307 });
  const [t] = useTranslation('dashboard');

  const scheduledAweekAppointments = useMemo(() => {
    const now = new Date();

    const startOfWeek = isAfter(now, startOfISOWeek(now))
      ? startOfDay(now)
      : startOfISOWeek(now);

    return appointments
      ?.filter((x, i, a) => {
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
      ?.sort((a, b) => new Date(a.startAt) - new Date(b.startAt))
      ?.map((x, i) => {
        const date = new Date(x?.startAt);

        return (
          <div key={i}>
            <ScheduleCard
              duration={x.duration}
              lesson={x?.packageSubscription?.package?.course?.title}
              mentor={x.mentor}
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
      {appointments?.length === 0 && packageSubscriptions?.length === 0 ? (
        <div className="flex justify-center items-center gap-4 md:gap-[30px] w-full bg-gray-50 h-72 rounded-lg">
          <div className="flex flex-col items-center">
            <p className="text-[15px] text-gray-500 tracking-tight mb-6">
              You have <span className="text-color-purple">0 remaining</span>{' '}
              lessons
            </p>
            <AdaptiveDialog button={<Button>Purchase a package</Button>}>
              <div className="w-full max-w-[400px] m-auto text-center">
                <h2 className="mb-4 text-[22px] text-color-dark-purple font-bold">
                  Purchase lessons here!
                </h2>
                <p className="mb-6 text-[15px] text-color-dark-purple">
                  Start your journey with NaoNow by selecting the package that
                  best suits your needs.
                </p>
                <Button
                  onClick={() => navigate.push('/purchase')}
                  className="w-full h-14"
                >
                  Select a package
                </Button>
              </div>
            </AdaptiveDialog>
          </div>
        </div>
      ) : scheduledAweekAppointments?.length ? (
        isDesktop ? (
          <div className="mt-[30px] lg:overflow-y-auto">
            {scheduledAweekAppointments?.slice(0, 3)}
          </div>
        ) : (
          <div className="mt-[30px] lg:overflow-y-auto">
            {scheduledAweekAppointments && scheduledAweekAppointments[0]}
          </div>
        )
      ) : (
        <div className="flex justify-center items-center gap-4 md:gap-[30px] w-full bg-gray-50 h-72 rounded-lg">
          <p className="text-[15px] text-gray-300 tracking-tight mb-6">
            You don&apos;t have any lessons yet
          </p>
        </div>
      )}

      {scheduledAweekAppointments?.length > 3 && (
        <Link
          to="/student/lesson-calendar"
          className="hidden xl:flex w-full bg-color-purple bg-opacity-10 justify-center gap-1 items-center text-color-purple font-medium py-6 rounded-lg hover:opacity-80 mt-6"
        >
          All lessons ({scheduledAweekAppointments?.length}){' '}
          <FaArrowRight className="w-4 h-4" />
        </Link>
      )}
    </DashboardCard>
  );
};

export default MyLessons;
