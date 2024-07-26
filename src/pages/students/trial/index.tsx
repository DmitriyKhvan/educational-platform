import { COMBINED_TIMESHEETS_TRIAL } from "@/shared/apollo/queries/trial/combined-time-sheets-for-trials";
import { useEffect, useState } from "react";
import { ScheduleSelector } from "@/pages/students/schedule-lesson/schedule-selector";
import { AvailableTimes } from "@/pages/students/schedule-lesson/schedule-selector/available-times/available-times";
import { ScheduleProvider } from "@/pages/students/schedule-lesson/schedule-selector/schedule-provider";
import Confirmation from "@/pages/students/trial/confirmation";
import LessonDetails from "@/pages/students/trial/lesson-details";
import OnboardingTrial from "@/pages/students/trial/onboarding-trial";
import StepIndicator from "@/pages/students/trial/step-indicator";

import { useAuth } from "@/app/providers/auth-provider";

const Trial = () => {
	const { user: currentUser } = useAuth();

	const [step, setStep] = useState(-1);
	const [user, setUser] = useState({});
	const [selectedPlan, setSelectedPlan] = useState({});
	const [schedule, setSchedule] = useState("");
	const [selectMentor, setSelectMentor] = useState("");
	useEffect(() => {
		if (currentUser) {
			const { phoneNumber, email, timeZone } = currentUser;

			setUser({
				phoneNumber,
				email,
				timeZone,
			});
		}
	}, [currentUser]);

	return (
		<div className="max-w-[440px] mx-auto">
			{step > -1 && step < 4 && <StepIndicator step={step} />}
			{step === -1 && (
				<OnboardingTrial
					currentUser={currentUser}
					user={user}
					selectedPlan={selectedPlan}
					setUser={setUser}
					setStep={setStep}
					setSelectMentor={setSelectMentor}
				/>
			)}
			{step === 0 && (
				<LessonDetails
					schedule={schedule}
					selectedPlan={selectedPlan}
					setSelectedPlan={setSelectedPlan}
					setStep={setStep}
				/>
			)}

			<ScheduleProvider
				query={COMBINED_TIMESHEETS_TRIAL}
				setTabIndex={setStep}
				setSchedule={setSchedule}
				duration={selectedPlan?.packageSubscription?.sessionTime}
				selectedMentor={selectMentor}
				setSelectMentor={setSelectMentor}
				timeZone={user?.timeZone}
			>
				{step === 1 && <ScheduleSelector />}

				{step === 2 && <AvailableTimes />}
			</ScheduleProvider>

			{step === 3 && (
				<Confirmation
					setStep={setStep}
					user={user}
					selectedPlan={selectedPlan}
					schedule={schedule}
					mentorId={selectMentor.id}
				/>
			)}
		</div>
	);
};

export default Trial;
