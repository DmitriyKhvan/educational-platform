import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { courseColorsDict, COURSE_COLORS } from 'src/shared/constants/global';
import { COURSES } from 'src/shared/apollo/queries/courses/courses';

let ready = false;
let colorsIdx = 0;
const courseColors = {};
const courseColorsArray = Object.values(COURSE_COLORS);

export const useCourseColors = () => {
  const { data: colorData, loading } = useQuery(COURSES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      trialFilter: 'only_regular',
    },
  });

  const [sortedData, setSortedData] = useState();

  useEffect(() => {
    if (colorData) {
      const sortedData = colorData?.courses
        .filter((c) => c.active)
        .sort((a, b) => Number(a.id) - Number(b.id));

      sortedData.forEach((val) => {
        if (!courseColors[String(val.id)]) {
          courseColors[String(val.id)] =
            courseColorsDict[courseColorsArray[colorsIdx++]];
        }
      });

      setSortedData(sortedData);

      ready = true;
    }
  }, [colorData]);

  const getColorByCourseId = useCallback((id) => {
    if (!id || !ready) return;
    if (!courseColors[String(id)]) {
      courseColors[String(id)] =
        courseColorsDict[courseColorsArray[colorsIdx++]];
    }
    return courseColors[id];
  }, []);

  return {
    getColorByCourseId,
    coursesList: sortedData,
    colorsReady: !loading && ready,
  };
};
