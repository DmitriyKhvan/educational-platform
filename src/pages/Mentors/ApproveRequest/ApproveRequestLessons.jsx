import React from 'react';

import { useTranslation } from 'react-i18next';

import { ApproveRequestLesson } from './ApproveRequestLesson';

export const ApproveRequestLessons = ({ lessons, refetchAppointments }) => {
  const [t] = useTranslation('lessons');

  const tableHead = [
    t('student_id'),
    t('student_name'),
    t('student_email'),
    t('lesson_number'),
    t('lesson_date'),
  ];

  return (
    <table className="table">
      <thead>
        <tr>
          {tableHead.map((x) => (
            <th scope="col" key={x}>
              {x}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {lessons.length === 0 && (
          <tr>
            <td colSpan={tableHead.length} align="center">
              {t('no_lessons')}
            </td>
          </tr>
        )}
        {lessons.map((lesson) => (
          <ApproveRequestLesson
            key={lesson.id}
            lesson={lesson}
            refetchAppointments={refetchAppointments}
          />
        ))}
      </tbody>
    </table>
  );
};
