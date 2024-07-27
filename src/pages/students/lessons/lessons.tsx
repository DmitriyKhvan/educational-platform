import { LessonsList } from "@/components/lessons-list";
import { APPOINTMENTS_QUERY, PACKAGE_QUERY } from "@/shared/apollo/graphql";
import { getItemToLocalStorage } from "@/shared/constants/global";
import { useQuery } from "@apollo/client";

const Lessons = () => {
	const {
		refetch: getAppointments,
		data: appointments,
		loading: loadingAppointments,
	} = useQuery(APPOINTMENTS_QUERY, {
		variables: {
			studentId: getItemToLocalStorage("studentId", ""),
			status: `approved,scheduled,rescheduled,paid,completed,in_progress,canceled`,
		},
		fetchPolicy: "no-cache",
	});

	const {
		data: { packageSubscriptions: planStatus = [] } = {},
	} = useQuery(PACKAGE_QUERY, {
		fetchPolicy: "no-cache",
		variables: {
			studentId: getItemToLocalStorage("studentId", ""),
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
