import { COURSES } from "@/shared/apollo/queries/courses/courses";
import {
	COURSE_COLORS,
	type CourseColorType,
	courseColorsDict,
} from "@/shared/constants/global";
import type { Course, Query } from "@/types/types.generated";
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";

let ready = false;
let colorsIdx = 0;
const courseColors: { [key: string]: { event: string; indicator: string } } =
	{};
const courseColorsArray = Object.values(COURSE_COLORS);

export const useCourseColors = () => {
	const { data: colorData, loading } = useQuery<Query>(COURSES, {
		fetchPolicy: "cache-and-network",
		variables: {
			trialFilter: "only_regular",
		},
	});

	const [sortedData, setSortedData] = useState<Course[] | undefined>(undefined);

	useEffect(() => {
		if (colorData?.courses) {
			const sorted = colorData.courses
				.filter((c) => c?.active)
				.sort((a, b) => Number(a?.id) - Number(b?.id));

			for (const val of sorted) {
				if (!courseColors[String(val?.id)]) {
					courseColors[String(val?.id)] =
						courseColorsDict[courseColorsArray[colorsIdx++] as CourseColorType];
				}
			}
			setSortedData(sorted as Course[]);

			ready = true;
		}
	}, [colorData]);

	const getColorByCourseId = useCallback((id: string) => {
		if (!id || !ready) return;
		if (!courseColors[String(id)]) {
			courseColors[String(id)] =
				courseColorsDict[courseColorsArray[colorsIdx++] as CourseColorType];
		}
		return courseColors[id];
	}, []);

	return {
		getColorByCourseId,
		coursesList: sortedData,
		colorsReady: !loading && ready,
	};
};
