import { AVAILABLE_MENTORS } from "@/shared/apollo/queries/mentors/available-medntors";
import { useQuery } from "@apollo/client";
import  { useEffect, type Dispatch, type SetStateAction } from "react";

import { format, toZonedTime } from "date-fns-tz";
import { useTranslation } from "react-i18next";

import Loader from "@/components/loader/loader";
import { IoArrowBack } from "react-icons/io5";
import { getItemToLocalStorage } from "@/shared/constants/global";
import { MentorsView } from "@/pages/students/mentors-list/mentors-view";
import type {  Mentor } from "@/types/types.generated";

const useAvailableMentors = (isoTime: string, duration: number, studentId: string) => {
	const {
		data: { availableMentors } = {},
		loading,
	} = useQuery(AVAILABLE_MENTORS, {
		variables: {
			time: isoTime,
			duration: duration,
			studentId: studentId,
		},
		fetchPolicy: "network-only",
	});
	return {
		availableMentors: availableMentors?.mentors || [],
		loading: loading,
	};
};

const SelectMentorCards = ({
	tabIndex,
	setTabIndex,
	setSelectMentor,
	schedule,
	step,
}: {
	tabIndex: number;
	setTabIndex: (index: number) => void;
	setSelectMentor: Dispatch<SetStateAction<Mentor | undefined>>
	schedule: string;
	step: number;
}) => {
	const [t] = useTranslation(["lessons", "common"]);

	const { availableMentors, loading } = useAvailableMentors(
		format(toZonedTime(new Date(schedule), "UTC"), "yyyy-MM-dd'T'HH:mm:ss", {
			timeZone: "UTC",
		}),
		step,
		getItemToLocalStorage("studentId", ""),
	);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [availableMentors]);

	const onClick = (mentor: Mentor) => {
		setSelectMentor(mentor);
		setTabIndex(4);
	};

	return (
		<div className="">
			<div className="flex flex-col md:items-center">
				<div className="flex items-center gap-3 mb-[10px]">
					<button
						onClick={() => {
							setTabIndex(1);
						}}
					>
						<IoArrowBack className="text-2xl" />
					</button>

					<h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold tracking-[-1px] text-color-dark-purple">
						{t("select_mentor")}
					</h1>
				</div>

				<p className="text-base leading-6 tracking-[-0.6px] text-color-light-grey">
					{t("select_mentor_subtitle")}
				</p>
			</div>

			{loading ? (
				<Loader />
			) : availableMentors?.length ? (
				<MentorsView
					mentorList={availableMentors}
					handleSelectMentor={onClick}
				/>
			) : (
				<p className="w-full text-center text-gray-500 uppercase">
					{t("no_mentors_available")}
				</p>
			)}
		</div>
	);
};

export default SelectMentorCards;
