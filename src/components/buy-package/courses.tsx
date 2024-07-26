import type { Course } from "@/types/types.generated";
import { memo } from "react";
import { useTranslation } from "react-i18next";

export const Courses = memo(function Courses({
	courses,
	setSelectedCourse,
	selectedCourse,
}: {
	courses?: Course[];
	setSelectedCourse: (course: Course) => void;
	selectedCourse: Course | null;
}) {
	const [t] = useTranslation("purchase");

	return (
		<div>
			<h4 className="text-[15px] font-semibold leading-[18px] mb-4">
				1. {t("choose_course")}
			</h4>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-wrap gap-3">
				{courses?.map((course) => {
					return (
						<label key={course.id}>
							<input
								type="radio"
								name="course"
								checked={course.id === selectedCourse?.id}
								className="hidden peer"
								onChange={() => {
									setSelectedCourse(course);
								}}
							/>

							<div className="flex justify-center w-full md:w-[188px] p-4 rounded-lg border border-color-border-grey peer-checked:text-color-purple peer-checked:border-color-purple/50 peer-checked:bg-[#F3EAFD] hover:border-color-purple/50 transition duration-300 ease-in-out cursor-pointer ">
								<span className="text-sm truncate">{course.title}</span>
							</div>
						</label>
					);
				})}
			</div>
		</div>
	);
});
