import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COURSE_COLORS } from 'src/constants/global';
import { COURSES } from 'src/modules/graphql/queries/courses/courses';

let ready = false;
let colorsIdx = 0;
const courseColors = {};
const courseColorsArray = Object.values(COURSE_COLORS);

export const useCourseDetails = () => {
  const [_, i18n] = useTranslation();

  const { data: colorData, loading } = useQuery(COURSES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      trialFilter: 'only_regular',
    },
  });
  const { data: translationsData } = useQuery(COURSES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      trialFilter: 'all',
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
          courseColors[String(val.id)] = courseColorsArray[colorsIdx++];
        }
      });

      setSortedData(sortedData);

      ready = true;
    }
  }, [colorData]);

  const getTitleByCourseId = useCallback(
    (id) => {
      const course = translationsData?.courses.find((c) => c.id == id);
      if (!course) return;
      if (i18n.language === 'en') return course.title;

      return (
        course.translations?.find((t) => t.language === i18n.language)?.title ??
        course.title ??
        ''
      );
    },
    [i18n, i18n.language, translationsData],
  );

  const getColorByCourseId = useCallback((id) => {
    if (!id || !ready) return;
    if (!courseColors[String(id)]) {
      courseColors[String(id)] = courseColorsArray[colorsIdx++];
    }
    return courseColors[id];
  }, []);

  return {
    getTitleByCourseId,
    getColorByCourseId,
    coursesList: sortedData,
    colorsReady: !loading && ready,
  };
};
