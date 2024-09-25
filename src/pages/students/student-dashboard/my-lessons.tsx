import Button from '@/components/form/button';
import { ModalPurchase } from '@/components/modal-purchase';
import ScheduleCard from '@/components/student-dashboard/schedule-card-rebranding';
import DashboardCard from '@/pages/students/student-dashboard/dashboard-card';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import type { Lesson, Maybe, PackageSubscription } from '@/types/types.generated';
import type { OperationVariables, ApolloQueryResult } from '@apollo/client';
import {
  addMinutes,
  endOfISOWeek,
  isAfter,
  isBefore,
  isWithinInterval,
  startOfDay,
  startOfISOWeek,
} from 'date-fns';
import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';

const MyLessons = ({ appointments, packageSubscriptions, fetchAppointments }: {appointments: Lesson[], packageSubscriptions: Maybe<PackageSubscription>[] | undefined, fetchAppointments: (variables?: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<any>>}) => {
  const isDesktop = useMediaQuery({ minWidth: 1307 });
  const [t] = useTranslation(['dashboard', 'lessons']);

  const scheduledAweekAppointments = useMemo(() => {
    const now = new Date();

    const startOfWeek = isAfter(now, startOfISOWeek(now)) ? startOfDay(now) : startOfISOWeek(now);

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
      ?.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
      ?.map((x, i) => {
        const date = new Date(x?.startAt);

        return (
          <div key={x.id}>
            <ScheduleCard
              duration={x.duration}
              // lesson={x?.packageSubscription?.package?.course?.title}
              mentor={x.mentor}
              date={date}
              data={x}
              // index={i}
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
              {/* You have <span className="text-color-purple">0 remaining</span>{' '}
              lessons */}
              <Trans
                t={t}
                ns={'lessons'}
                i18nKey="you_have_n_available_lessons"
                values={{
                  count: 0,
                }}
                components={{
                  purple: <span className="text-color-purple font-medium" />,
                }}
              />
            </p>
            <AdaptiveDialog button={<Button>Purchase a package</Button>}>
              <ModalPurchase />
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
            {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
            {scheduledAweekAppointments && scheduledAweekAppointments[0]}
          </div>
        )
      ) : (
        <div className="flex justify-center items-center gap-4 md:gap-[30px] w-full bg-gray-50 h-72 rounded-lg">
          <p className="text-[15px] text-gray-300 tracking-tight mb-6">
            {t('no_lessons', { ns: 'lessons' })}
          </p>
        </div>
      )}

      {scheduledAweekAppointments?.length > 3 && (
        <Link
          to="/student/lesson-calendar"
          className="hidden xl:flex w-full bg-color-purple bg-opacity-10 justify-center gap-1 items-center text-color-purple font-medium py-6 rounded-lg hover:opacity-80 mt-6"
        >
          {t('view_all')} ({scheduledAweekAppointments?.length}){' '}
          <FaArrowRight className="w-4 h-4" />
        </Link>
      )}
    </DashboardCard>
  );
};

export default MyLessons;
