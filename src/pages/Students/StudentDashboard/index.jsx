import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import { useParams, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getItemToLocalStorage } from '../../../constants/global';
import ModalFeedback from '../ModalFeedback';
import { useAuth } from '../../../modules/auth';
import { APPOINTMENTS_QUERY } from '../../../modules/auth/graphql';
import { useQuery } from '@apollo/client';

import DashboardCard from './DashboardCard';
import ScheduleBanner from './ScheduleBanner';
import MyLessons from './MyLessons';
import MyProgress from './MyProgress';
import { useMediaQuery } from 'react-responsive';

const options = [
  { value: 'upcoming_lesson', label: 'Upcoming Lessons' },
  { value: 'completed_lesson', label: 'Completed Lessons' },
];

const StudentListAppointments = () => {
  const isDesktop = useMediaQuery({ minWidth: 1307 });

  const { complete_appoint_id } = useParams();
  const [t] = useTranslation('dashboard');
  const [selectedOption] = useState(options[0]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { data: { lessons: appointments } = {}, refetch } = useQuery(
    APPOINTMENTS_QUERY,
    {
      variables: {
        status: 'scheduled,paid,completed,in_progress,approved',
        studentId: getItemToLocalStorage('studentId'),
      },
    },
  );
  const [completedAppointment, setCompleteAppointment] = useState(null);
  const history = useHistory();
  const onDismiss = () => setCompleteAppointment(null);

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
    await refetch();
    setIsLoading(false);
  };

  return (
    <Layout>
      <div className="bg-color-dashboard-bg min-h-screen pb-10 flex flex-wrap">
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

          {!isDesktop && !isLoading && (
            <div>
              <MyLessons
                fetchAppointments={fetchAppointments}
                appointments={appointments}
              />
            </div>
          )}

          <MyProgress
            fetchAppointments={fetchAppointments}
            appointments={appointments}
          />
        </div>

        <div className="hidden xl:block w-full mx-auto sm:max-w-[524px] sm:mt-10 2xl:ml-10 mt-1">
          {isDesktop && !isLoading && (
            <MyLessons
              fetchAppointments={fetchAppointments}
              appointments={appointments}
            />
          )}
        </div>
      </div>
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
