import React, { useEffect, useState } from "react";
import { MentorAvailabilityType } from "../../../shared/constants/global";

import Loader from "@/components/loader/loader";
import { useQuery } from "@apollo/client";
import { useAuth } from "src/app/providers/auth-provider";
import { v4 as uuid } from "uuid";
import { GET_MENTOR } from "../../../shared/apollo/graphql";
import { AcceptingStudents } from "../accepting-students";
import { AvailabilityExceptions } from "../availability-exceptions";
import { AvailabilitySlots } from "./availability-slots";
import { Tab } from "./tab";

export const AvailabilityList = () => {
	const { user } = useAuth();
	const [mentorAvailabilityType, setMentorAvailabilityType] = useState();
	const [error, setError] = useState(null);

	const {
		data: { mentor: mentorInfo } = {},
		loading: loadingMentor,
		refetch: refetchMentor,
	} = useQuery(GET_MENTOR, {
		fetchPolicy: "no-cache",
		variables: { id: user?.mentor?.id },
	});

	const [gatherAvailabilities, setGatherAvailabilities] = useState({
		[MentorAvailabilityType.ONLY_REGULAR]: [],
		[MentorAvailabilityType.ONLY_TRIAL]: [],
	});

	const initializeAvailabilities = (availabilities, mentorAvailabilityType) => {
		const parseAvailabilities = availabilities.map((slot) => {
			return {
				id: uuid(),
				day: slot.day,
				slots: [slot],
			};
		});

		setGatherAvailabilities((gatherAvailabilities) => {
			return {
				...gatherAvailabilities,
				[mentorAvailabilityType]: parseAvailabilities,
			};
		});
	};

	useEffect(() => {
		if (mentorInfo) {
			const mentorType =
				mentorInfo.mentorAvailability === MentorAvailabilityType.ONLY_REGULAR ||
				mentorInfo.mentorAvailability ===
					MentorAvailabilityType.REGULAR_AND_TRIAL
					? MentorAvailabilityType.ONLY_REGULAR
					: MentorAvailabilityType.ONLY_TRIAL;

			setMentorAvailabilityType(mentorType);
		}

		if (mentorInfo?.availabilities?.regular.length) {
			initializeAvailabilities(
				mentorInfo.availabilities.regular,
				MentorAvailabilityType.ONLY_REGULAR,
			);
		}

		if (mentorInfo?.availabilities?.trial.length) {
			initializeAvailabilities(
				mentorInfo.availabilities.trial,
				MentorAvailabilityType.ONLY_TRIAL,
			);
		}
	}, [mentorInfo, error]);

	const useSetGatherAvailabilities = (data) => {
		setGatherAvailabilities((gatherAvailabilities) => {
			return {
				...gatherAvailabilities,
				[mentorAvailabilityType]: data,
			};
		});
	};

	if (loadingMentor) {
		return <Loader height="calc(100vh - 80px)" />;
	}

	return (
		<>
			<div className="relative w-full flex items-center after:content-[''] after:absolute after:bottom-0 after:w-full after:h-[2px] after:bg-gray-100 after:-z-10">
				{mentorInfo.mentorAvailability ===
				MentorAvailabilityType.REGULAR_AND_TRIAL ? (
					<>
						<Tab
							active={
								mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR
							}
							onClick={() =>
								setMentorAvailabilityType(MentorAvailabilityType.ONLY_REGULAR)
							}
						>
							Regular Students
						</Tab>

						<Tab
							active={
								mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL
							}
							onClick={() =>
								setMentorAvailabilityType(MentorAvailabilityType.ONLY_TRIAL)
							}
						>
							Trial Students
						</Tab>
					</>
				) : mentorInfo.mentorAvailability ===
					MentorAvailabilityType.ONLY_TRIAL ? (
					<Tab
						active={
							mentorAvailabilityType === MentorAvailabilityType.ONLY_TRIAL
						}
						onClick={() =>
							setMentorAvailabilityType(MentorAvailabilityType.ONLY_TRIAL)
						}
					>
						Trial Students
					</Tab>
				) : null}
			</div>

			{mentorAvailabilityType === MentorAvailabilityType.ONLY_REGULAR && (
				<AcceptingStudents />
			)}

			<div className="flex flex-wrap gap-6">
				<AvailabilitySlots
					mentorInfo={mentorInfo}
					gatherAvailabilities={gatherAvailabilities}
					mentorAvailabilityType={mentorAvailabilityType}
					useSetGatherAvailabilities={useSetGatherAvailabilities}
					refetchMentor={refetchMentor}
					setError={setError}
				/>

				<AvailabilityExceptions
					mentor={mentorInfo}
					refetchMentor={refetchMentor}
				/>
			</div>
		</>
	);
};
