import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ApproveRequestLesson } from './ApproveRequestLesson';
import Loader from 'src/components/Loader/Loader';

export const ApproveRequestLessons = ({ lessons, refetchAppointments }) => {
  const [approveLoading, setApproveLoading] = useState(false);

  const [t] = useTranslation('lessons');

  const tableHead = [
    t('student_id'),
    t('student_name'),
    t('student_email'),
    t('lesson_number'),
    t('lesson_date'),
  ];

  return (
    <>
      {approveLoading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

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
              setApproveLoading={setApproveLoading}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
