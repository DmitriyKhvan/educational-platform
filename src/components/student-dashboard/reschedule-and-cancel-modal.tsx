import React, { useState } from "react";
import CancelWarningModal from "./CancelWarningModal";
import CancelLessonModal from "./cancel-lesson-modal";
import CancellationPolicyModal from "./cancellation-policy-modal";

import ModalWrapper from "../modal-wrapper/modal-wrapper";

const RescheduleAndCancelModal = ({
	data,
	isOpen,
	closeModal,
	setTabIndex,
	setIsOpen,
	fetchAppointments,
	tabIndex,
	type,
	// cancelled,
	setCanceledLessons,
	duration,
}) => {
	const [repeatLessons, setRepeatLessons] = useState(false);

	return (
		<ModalWrapper isOpen={isOpen} closeModal={closeModal}>
			{tabIndex === 0 ? (
				<CancelWarningModal
					data={data}
					setTabIndex={setTabIndex}
					setIsOpen={setIsOpen}
					duration={duration}
					type={type}
					modifyCredits={data?.packageSubscription?.modifyCredits}
					setRepeatLessons={setRepeatLessons}
					repeatLessons={repeatLessons}
				/>
			) : tabIndex === 1 ? (
				<CancelLessonModal
					setTabIndex={setTabIndex}
					setIsOpen={setIsOpen}
					id={data.id}
					fetchAppointments={fetchAppointments}
					// cancelled={cancelled}
					setCanceledLessons={setCanceledLessons}
					repeatLessons={repeatLessons}
				/>
			) : (
				tabIndex === 10 && (
					<CancellationPolicyModal
						setTabIndex={setTabIndex}
						setIsOpen={setIsOpen}
					/>
				)
			)}
		</ModalWrapper>
	);
};

export default RescheduleAndCancelModal;
