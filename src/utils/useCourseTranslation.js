import { useQuery } from '@apollo/client';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { courses } from 'src/constants/global';
import { COURSES } from 'src/modules/graphql/queries/courses/courses';

export const useCourseTranslation = () => {
  const [_, i18n] = useTranslation();
  const { data: coursesData } = useQuery(COURSES, {
    fetchPolicy: 'network-only',
  });

  const getTitleByCourseId = useCallback(
    (id) => {
      const course = coursesData?.courses.find((c) => c.id === id);
      if (!course) return;
      if (i18n.language === 'en') return course.title;

      return course.translations.find((t) => t.language === i18n.language)
        ?.title;
    },
    [i18n, i18n.language, coursesData],
  );

  return { getTitleByCourseId };
};
