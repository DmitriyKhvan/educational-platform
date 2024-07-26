import MyDropdownMenu from "@/components/dropdown-menu";
import Button from "@/components/form/button";
import CheckboxField from "@/components/form/checkbox-field";
import { CHANGE_STUDENT_LEVEL } from "@/shared/apollo/queries/levels/change-student-language-level";
import { LANGUAGE_LEVELS_WITH_PAGINATION } from "@/shared/apollo/queries/levels/language-levels-with-pagination";
import notify from "@/shared/utils/notify";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AdaptiveDialog } from "@/shared/ui/adaptive-dialog/index.jsx";
import { Avatar } from "@/widgets/avatar/avatar";
import { PLAYGROUND_LESSON } from "@/shared/apollo/queries/lessons/playground-lesson";

const LevelAfterTrialModal = () => {
	const navigate = useNavigate();
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [isOpenDropdown, setIsOpenDropdown] = useState(false);
	const [currentLevel, setCurrentLevel] = useState();
	const urlSearchParams = new URLSearchParams(window.location.search);
	const playgroundId = urlSearchParams.get("playground");

	const { data: lessonData } = useQuery(PLAYGROUND_LESSON, {
		variables: { playgroundId },
		skip: !playgroundId,
	});
	const lesson = lessonData?.playgroundLesson;

	const [getLevels, { data: levelsData }] = useLazyQuery(
		LANGUAGE_LEVELS_WITH_PAGINATION,
		{
			variables: { limit: 999 },
		},
	);

	const [changeStudentLevel, { loading: mutationLoading }] =
		useMutation(CHANGE_STUDENT_LEVEL);

	const { register, handleSubmit, watch } = useForm({
		values: {
			languageLevelId: lesson?.student?.languageLevel?.id,
		},
	});

	useEffect(() => {
		if (lesson?.isTrial) {
			getLevels();
			setIsOpenModal(true);
		}
	}, [lesson]);

	const languageLevel = useMemo(() => {
		const currentLevel =
			levelsData?.languageLevelsWithPagination?.languageLevels?.find(
				(topic) => topic.id === watch("languageLevelId"),
			);

		setCurrentLevel(currentLevel);

		return (
			currentLevel?.title || (
				<span className="text-[#BBBBC4]">Select a level</span>
			)
		);
	}, [watch("languageLevelId"), currentLevel]);

	const onSubmit = ({ languageLevelId }) => {
		changeStudentLevel({
			variables: {
				studentId: lesson?.student?.id,
				languageLevelId: Number(languageLevelId),
			},
			onCompleted: () => {
				setIsOpenModal(false);
				navigate("/mentor/manage-appointments");
				notify("Student level successfully updated");
			},
		});
	};

	return (
		<AdaptiveDialog open={isOpenModal} hideCloseBtn={true}>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className="mb-7">
					<h2 className="text-xl font-bold text-color-dark-violet mb-4">
						Trial student level
					</h2>
					<p className="text-color-dark-violet">
						Determine the final level of your trial student
					</p>
				</div>

				<div className="flex gap-3 bg-color-bg-grey2 rounded-lg px-4 py-3 mb-7">
					<Avatar
						fallback="duck"
						className="bg-color-purple rounded-full w-10 h-10"
					/>
					<div>
						<p className="text-color-dark-violet text-sm font-medium">
							{lesson?.student?.firstName} {lesson?.student?.lastName}
						</p>
						<p className="text-color-purple text-sm">
							{lesson?.student?.languageLevel?.title}
						</p>
					</div>
				</div>

				<div className="mb-6">
					<p className="mb-3 text-[15px] font-semibold text-color-dark-violet">
						Final level
					</p>
					<MyDropdownMenu
						open={isOpenDropdown}
						setOpen={setIsOpenDropdown}
						button={
							<Button
								theme="clear"
								className="flex items-center justify-between py-[14px] pl-3 pr-2 rounded-lg w-full border border-color-border-grey select-none"
							>
								<p className="text-sm font-medium">{languageLevel}</p>
								<MdOutlineKeyboardArrowDown className="w-4" />
							</Button>
						}
					>
						<ul className="overflow-y-scroll max-h-72 sm:w-[336px]">
							{levelsData?.languageLevelsWithPagination?.languageLevels?.map(
								(topic) => {
									return (
										<li
											key={topic.id}
											className="border-b border-color-border-grey last:border-b-0"
										>
											<label className="flex items-center justify-between gap-3 py-4 px-6 cursor-pointer">
												<p>{topic.title}</p>
												<CheckboxField
													type="radio"
													value={topic.id}
													onClick={() => setIsOpenDropdown(false)}
													{...register("languageLevelId", {
														required: "Language level is required",
													})}
												/>
											</label>
										</li>
									);
								},
							)}
						</ul>
					</MyDropdownMenu>
				</div>
				<Button
					disabled={mutationLoading || !watch("languageLevelId")}
					type="submit"
					className="w-full"
				>
					Save
				</Button>
			</form>
		</AdaptiveDialog>
	);
};

export default LevelAfterTrialModal;
