import React from "react";

import { APPOINTMENTS_QUERY, PACKAGE_QUERY } from "@/shared/apollo/graphql";
import { useQuery } from "@apollo/client";
import { LessonsList } from "src/components/lessons-list";
import { getItemToLocalStorage } from "src/shared/constants/global";

const Lessons = () => {
	const {
		refetch: getAppointments,
		data: appointments,
		loading: loadingAppointments,
	} = useQuery(APPOINTMENTS_QUERY, {
		variables: {
			studentId: getItemToLocalStorage("studentId"),
			status: `approved,scheduled,rescheduled,paid,completed,in_progress,canceled`,
		},
		fetchPolicy: "no-cache",
	});

	const {
		data: { packageSubscriptions: planStatus = [] } = {},
	} = useQuery(PACKAGE_QUERY, {
		fetchPolicy: "no-cache",
		variables: {
			studentId: getItemToLocalStorage("studentId"),
		},
	});

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
