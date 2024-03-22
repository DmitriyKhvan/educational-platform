import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

const NoLessonsMessage = ({ selectedTab, availableCredits }) => {
  const [t] = useTranslation(['lessons']);

  return (
    <>
      {selectedTab === 'pastLessons' ? (
        <div className="w-full bg-gray-50 rounded-lg mt-8 py-[47px]">
          <p className="text-color-dark-purple text-sm text-center mb-6">
            {t('no_completed_lessons')}
          </p>
        </div>
      ) : (
        <div className="w-full bg-gray-50 rounded-lg mt-8 py-[47px]">
          <p className="text-color-dark-purple text-sm text-center mb-6">
            <Trans
              t={t}
              i18nKey="you_have_n_available_lessons"
              values={{
                count: availableCredits ?? 0,
              }}
              components={{
                purple: <span className="text-color-purple font-medium" />,
              }}
            />
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/student/schedule-lesson/select"
              className="block rounded-lg bg-color-purple px-4 py-4 text-white font-medium sm:font-semibold text-xs sm:text-sm text-center"
            >
              {t('schedule_by_time', { ns: 'dashboard' })}
            </Link>
            <Link
              to="/student/mentors-list"
              className="block rounded-lg bg-color-purple px-4 py-4 text-white font-medium sm:font-semibold text-xs sm:text-sm text-center"
            >
              {t('schedule_by_mentor', { ns: 'dashboard' })}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default NoLessonsMessage;
