import React from 'react';

import { useQuery } from '@apollo/client';
import { APPOINTMENTS_QUERY, PACKAGE_QUERY } from 'src/shared/apollo/graphql';
import { getItemToLocalStorage } from 'src/shared/constants/global';
import { LessonsList } from 'src/components/LessonsList';

const Lessons = () => {
  const {
    refetch: getAppointments,
    data: appointments,
    loading: loadingAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      studentId: getItemToLocalStorage('studentId'),
      status: `approved,scheduled,rescheduled,paid,completed,in_progress,canceled`,
    },
    fetchPolicy: 'no-cache',
  });

  const { data: { packageSubscriptions: planStatus = [] } = {} } = useQuery(
    PACKAGE_QUERY,
    {
      fetchPolicy: 'no-cache',
      variables: {
        studentId: getItemToLocalStorage('studentId'),
      },
    },
  );

  return (
    <LessonsList
      getAppointments={getAppointments}
      appointments={appointments}
      loadingAppointments={loadingAppointments}
      planStatus={planStatus}
    />
  );
};

export default Lessons;
