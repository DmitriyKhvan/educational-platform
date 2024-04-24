import React from 'react';

import { useQuery } from '@apollo/client';
import { APPOINTMENTS_QUERY } from 'src/modules/auth/graphql';
import { LessonsList } from 'src/components/LessonsList';
import { useAuth } from 'src/modules/auth';

const Lessons = () => {
  const { user } = useAuth();

  const {
    refetch: getAppointments,
    data: appointments,
    loading: loadingAppointments,
  } = useQuery(APPOINTMENTS_QUERY, {
    variables: {
      mentorId: user?.mentor?.id,
      status: `approved,scheduled,rescheduled,paid,completed,in_progress,canceled`,
    },
    fetchPolicy: 'no-cache',
  });

  return (
    <LessonsList
      getAppointments={getAppointments}
      appointments={appointments}
      loadingAppointments={loadingAppointments}
    />
  );
};

export default Lessons;
