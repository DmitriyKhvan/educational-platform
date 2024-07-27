import  { useState } from "react";
import CancelWarningModal from "@/components/student-dashboard/cancel-warning-modal";
import CancelLessonModal from "@/components/student-dashboard/cancel-lesson-modal";
import CancellationPolicyModal from "@/components/student-dashboard/cancellation-policy-modal";
import type { ModalType } from "@/shared/constants/global";
import type { CalendarEvent } from "@/types";

const RescheduleAndCancelModal = ({
	data,
	setTabIndex,
	setIsOpen,
	fetchAppointments,
	tabIndex,
	type,
	setCanceledLessons,
	duration,
}: {
	data: CalendarEvent ;
	setTabIndex: (arg0: number) => void;
	setIsOpen: (arg0: boolean) => void;
	fetchAppointments: () => void;
	tabIndex: number;
	type: ModalType;
	setCanceledLessons: (arg0: any) => void;
	duration: number;
}) => {
	const [repeatLessons, setRepeatLessons] = useState(false);

	return (
		<>
			{tabIndex === 0 ? (
				<CancelWarningModal
					data={data}
					setTabIndex={setTabIndex}
					type={type}
					modifyCredits={data?.packageSubscription?.modifyCredits}
					setRepeatLessons={setRepeatLessons}
					repeatLessons={repeatLessons}
				/>
			) : tabIndex === 1  ? (data) && (
				<CancelLessonModal
					id={data.id}
					setTabIndex={setTabIndex}
					setIsOpen={setIsOpen}
					fetchAppointments={fetchAppointments}
					// cancelled={cancelled}
					setCanceledLessons={setCanceledLessons}
					repeatLessons={repeatLessons}
				/>
			) : (
				tabIndex === 10 && (
					<CancellationPolicyModal
						setTabIndex={setTabIndex}
						
					/>
				)
			)}
		</>
	);
};

export default RescheduleAndCancelModal;
