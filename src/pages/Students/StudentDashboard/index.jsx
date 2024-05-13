import React from 'react';
import Layout from '../../../layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';
import { getItemToLocalStorage } from '../../../constants/global';
import { useAuth } from '../../../modules/auth';
import { APPOINTMENTS_QUERY } from '../../../modules/auth/graphql';
import { useQuery } from '@apollo/client';

import DashboardCard from './DashboardCard';
import ScheduleBanner from './ScheduleBanner';
import MyLessons from './MyLessons';
import MyProgress from './MyProgress';
import { useMediaQuery } from 'react-responsive';
import Loader from 'src/components/Loader/Loader';
import { useActivePackages } from 'src/utils/useActivePackages';

const StudentListAppointments = () => {
  const isDesktop = useMediaQuery({ minWidth: 1400 });

  const [t] = useTranslation('dashboard');

  const { user } = useAuth();

  const { activePackages, isLoading } = useActivePackages();

  const {
    data: { lessons: appointments } = {},
    loading: lessonLoading,
    refetch,
  } = useQuery(APPOINTMENTS_QUERY, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    variables: {
      status: 'scheduled,rescheduled,paid,completed,in_progress,approved',
      studentId: getItemToLocalStorage('studentId'),
    },
  });

  return (
    <Layout>
      {lessonLoading || isLoading ? (
        <Loader height="100%" />
      ) : (
        <div className="bg-color-dashboard-bg min-h-full pb-8 flex flex-wrap -m-5 sm:-mx-10 sm:-my-8">
          <div className="space-y-1 sm:space-y-8 sm:max-w-[524px] mx-auto sm:mt-10 w-full">
            <DashboardCard
              title={t('student_dashboard_welcome', {
                ns: 'dashboard',
                name: user.firstName,
              })}
              subtitle={t('student_dashboard_subtitle', { ns: 'dashboard' })}
            >
              <ScheduleBanner activePackages={activePackages} />
            </DashboardCard>

            {!isDesktop && (
              <div>
                <MyLessons
                  fetchAppointments={refetch}
                  appointments={appointments}
                  packageSubscriptions={activePackages}
                />
              </div>
            )}
            <MyProgress
              fetchAppointments={refetch}
              appointments={appointments}
            />
          </div>

          {isDesktop && (
            <div className="w-full mx-auto sm:max-w-[524px] sm:mt-10 mt-1">
              <MyLessons
                fetchAppointments={refetch}
                appointments={appointments}
                packageSubscriptions={activePackages}
              />
            </div>
          )}
        </div>
      )}
    </Layout>
  );
};
export default StudentListAppointments;
