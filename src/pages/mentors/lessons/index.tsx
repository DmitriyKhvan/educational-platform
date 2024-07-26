import React from "react";

import { APPOINTMENTS_QUERY } from "@/shared/apollo/graphql";
import { useQuery } from "@apollo/client";
import { useAuth } from "src/app/providers/auth-provider";
import { LessonsList } from "src/components/lessons-list";

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
		fetchPolicy: "no-cache",
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
