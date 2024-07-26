import InputField from "@/components/form/input-field";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillGridFill } from "react-icons/bs";
import { FaList } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { MentorCard } from "./mentor-card";
import { MentorCard2 } from "./mentor-card-2";

export const MentorsView = ({ mentorList, handleSelectMentor }) => {
	const [t] = useTranslation(["studentMentor", "common"]);

	const [mentors, setMentors] = useState(
		[...mentorList].sort((a, b) => a.sortOrder - b.sortOrder),
	);

	const [viewMentorList, setViewMentorList] = useState("list");

	const searchMentors = (value) => {
		let newMentors = [...mentorList].sort((a, b) => a.sortOrder - b.sortOrder);

		if (value) {
			newMentors = mentorList
				.filter((mentor) =>
					mentor?.fullName?.toLowerCase().includes(value.toLowerCase()),
				)
				.sort((a, b) => a.sortOrder - b.sortOrder);
		}

		setMentors(newMentors);
	};

	const toogleView = (view) => {
		setViewMentorList(view);
	};

	return (
		<>
			<div className="flex items-center justify-between gap-4 my-10">
				<InputField
					className="w-full max-w-[560px] h-[50px] sm:h-[58px] pl-5 placeholder:text-gray-300"
					classNameIcon="h-[50px] sm:h-[58px] pr-5 text-xl"
					placeholder="Search..."
					icon={<FiSearch />}
					onChange={(e) => searchMentors(e.target.value)}
				/>

				<div className="flex gap-4">
					<FaList
						onClick={() => toogleView("list")}
						className={`text-2xl cursor-pointer ${
							viewMentorList === "list" ? "text-color-purple" : "text-gray-300"
						}`}
					/>
					<BsFillGridFill
						onClick={() => toogleView("grid")}
						className={`text-2xl cursor-pointer ${
							viewMentorList === "grid" ? "text-color-purple" : "text-gray-300"
						}`}
					/>
				</div>
			</div>

			<div className="flex flex-wrap mt-10 gap-6 select-none">
				{mentors?.length !== 0 ? (
					mentors?.map((mentor) => {
						if (viewMentorList === "grid") {
							return (
								<MentorCard
									key={mentor.id}
									mentor={mentor}
									handleSelectMentor={handleSelectMentor}
								/>
							);
						} else {
							return (
								<MentorCard2
									key={mentor.id}
									mentor={mentor}
									handleSelectMentor={handleSelectMentor}
								/>
							);
						}
					})
				) : (
					<p className="w-full text-center text-gray-500 uppercase">
						{t("cannot_find_mentors")}
					</p>
				)}
			</div>
		</>
	);
};
