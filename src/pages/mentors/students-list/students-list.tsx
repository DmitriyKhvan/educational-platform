import React from "react";

import FavIcon from "@/shared/assets/images/Favorite.png";
import femaleAvatar from "@/shared/assets/images/avatars/img_avatar_female.png";
import maleAvatar from "@/shared/assets/images/avatars/img_avatar_male.png";
import "@/pages/mentors/students-list/students.scss";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/loader/loader";
import { STUDENTS_QUERY } from "@/shared/apollo/graphql";
import StudentsModal from "@/pages/mentors/students-list/students-modal";

export default function StudentsList() {
	const [showStudentModal, setShowStudentModal] = React.useState(false);
	const navigate = useNavigate();
	const { data } = useQuery(STUDENTS_QUERY, {
		errorPolicy: "ignore",
	});
	const students = data?.students?.filter((i) => i.user?.isActive);

	const [t] = useTranslation(["common", "studentMentor"]);

	const handleStatusTutor = () => {};

	const handleMoreTutor = (id) => {
		if (id) {
			navigate(`/mentor/students-list/${id}`);
		}

		setShowStudentModal(true);
	};

	return (
		<>
			<div className="tutors_section">
				<div className="tutors_title">
					<h1>{t("student_list", { ns: "studentMentor" })}</h1>
					<p>{t("student_list_desc", { ns: "studentMentor" })}</p>
				</div>

				<div className="tutors_row">
					{students?.length === 0 && <p>Empty</p>}

					{!students && <Loader height={"50vh"} />}

					{students &&
						students.map((item) => (
							<div key={item.id} className="tutors_card">
								<div
									className="tutors_card-img"
									style={{
										background: `url("${
											item?.avatar
												? item.avatar?.url
												: item?.user?.gender === "male"
													? maleAvatar
													: femaleAvatar
										}") center / cover`,
									}}
								>
									{item.isFavourite && <img src={FavIcon} alt="" />}
								</div>
								<div className="tutors_card-body">
									<div className="tutors_info">
										<h2>{item.userName}</h2>
										<p>{item.university}</p>
										<span>{item.language}</span>
									</div>
									<div className="tutors_control-buttons">
										<button onClick={() => handleMoreTutor(item.id)}>
											{t("learn_more", { ns: "common" })}
										</button>
									</div>
								</div>
							</div>
						))}
				</div>
			</div>

			{showStudentModal && (
				<StudentsModal
					studentList={students}
					handleStatusTutor={handleStatusTutor}
					setShowStudentModal={setShowStudentModal}
				/>
			)}
		</>
	);
}
