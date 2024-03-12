import React, { useEffect, useState } from 'react';
import Layout from '../../../layouts/DashboardLayout';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getItemToLocalStorage } from '../../../constants/global';
import ModalFeedback from '../ModalFeedback';
import { useAuth } from '../../../modules/auth';
import { APPOINTMENTS_QUERY } from '../../../modules/auth/graphql';
import { PACKAGE_QUERY } from 'src/modules/auth/graphql';
import { useQuery, useLazyQuery } from '@apollo/client';

import DashboardCard from './DashboardCard';
import ScheduleBanner from './ScheduleBanner';
import MyLessons from './MyLessons';
import MyProgress from './MyProgress';
import { useMediaQuery } from 'react-responsive';
import Loader from 'src/components/Loader/Loader';

const StudentListAppointments = () => {
  const isDesktop = useMediaQuery({ minWidth: 1307 });

  const { complete_appoint_id } = useParams();
  const [t] = useTranslation('dashboard');

  const { user } = useAuth();

  const {
    data: { lessons: appointments } = {},
    loading: lessonLoading,
    refetch,
  } = useQuery(APPOINTMENTS_QUERY, {
    fetchPolicy: 'network-only',
    variables: {
      status: 'scheduled,paid,completed,in_progress,approved',
      studentId: getItemToLocalStorage('studentId'),
    },
  });

  const [getPackageSubscriptions, { data: { packageSubscriptions } = {} }] =
    useLazyQuery(PACKAGE_QUERY, {
      fetchPolicy: 'network-only',
      variables: {
        studentId: getItemToLocalStorage('studentId'),
      },
    });

  const [completedAppointment, setCompleteAppointment] = useState(null);
  const onDismiss = () => setCompleteAppointment(null);

  useEffect(() => {
    if (complete_appoint_id) {
      const feedbackAppt = appointments?.find(
        (apt) => apt.id == complete_appoint_id,
      );
      setCompleteAppointment(feedbackAppt);
    }

    if (appointments?.length === 0) {
      getPackageSubscriptions();
    }
  }, [appointments, complete_appoint_id]);

  return (
    <Layout>
      {lessonLoading ? (
        <Loader height="calc(100vh - 80px)" />
      ) : (
        <div className="bg-color-dashboard-bg min-h-full pb-10 flex flex-wrap">
          <div className=" space-y-1 sm:space-y-8 sm:max-w-[524px] mx-auto sm:mt-10 2xl:mr-10 w-full">
            <DashboardCard
              title={t('student_dashboard_welcome', {
                ns: 'dashboard',
                name: user.firstName,
              })}
              subtitle={t('student_dashboard_subtitle', { ns: 'dashboard' })}
            >
              <ScheduleBanner />
            </DashboardCard>

            {!isDesktop && (
              <div>
                <MyLessons
                  fetchAppointments={refetch}
                  appointments={appointments}
                  packageSubscriptions={packageSubscriptions}
                />
              </div>
            )}
            <MyProgress
              fetchAppointments={refetch}
              appointments={appointments}
            />
          </div>

          {isDesktop && (
            <div className="w-full mx-auto sm:max-w-[524px] sm:mt-10 2xl:ml-10 mt-1">
              <MyLessons
                fetchAppointments={refetch}
                appointments={appointments}
                packageSubscriptions={packageSubscriptions}
              />
            </div>
          )}
        </div>
      )}

      {completedAppointment && (
        <ModalFeedback
          onDismiss={() => {
            refetch();
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
