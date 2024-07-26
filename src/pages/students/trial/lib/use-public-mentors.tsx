import { PUBLIC_MENTOR_LIST } from "@/shared/apollo/queries/mentors/public-mentor-list";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

export const usePublicMentors = () => {
	const {
		data: { publicMentorList: trialMentors } = [],
	} = useQuery(PUBLIC_MENTOR_LIST, {
		fetchPolicy: "network-only",
	});

	const [trialMentorsDic, setTrialMentorsDic] = useState([]);

	useEffect(() => {
		if (trialMentors) {
			const trialMentorsDic = trialMentors.map((mentor) => {
				return {
					value: mentor.id,
					label: `${mentor.firstName} ${mentor.lastName}`,
				};
			});

			setTrialMentorsDic(trialMentorsDic);
		}
	}, [trialMentors]);

	return trialMentorsDic;
};
