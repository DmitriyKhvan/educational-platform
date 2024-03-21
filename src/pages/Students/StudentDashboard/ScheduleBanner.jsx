import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import duckImage from '../../../assets/images/duck.png';
import bannerLogo from '../../../assets/images/banner-logo.png';

const ScheduleBanner = () => {
  const [t] = useTranslation('dashboard');

  return (
    <div className="relative rounded-[10px] bg-color-banner-green h-[200px] p-6 overflow-hidden">
      <img
        src={duckImage}
        alt="duck"
        className="absolute right-0 bottom-0 z-[2] h-full"
      />
      <img
        src={bannerLogo}
        alt="banner"
        className="absolute right-0 top-0 z-[1] h-full"
      />
      <div className="flex flex-col gap-6 z-[3]">
        <div className="flex flex-col gap-4 sm:items-start z-[3]">
          <p className="text-[22px] font-bold tracking-tight text-white leading-normal">
            {t('schedule_card', { ns: 'dashboard' })}
          </p>
          <p className="text-[15px] h-[22px] text-white tracking-tight">
            {t('lets_learn_together', { ns: 'dashboard' })}
          </p>
        </div>
        <div className="flex justify-start gap-3 md:w-11/12 z-[3]">
          <Link
            to="/student/schedule-lesson/select"
            className="rounded-lg bg-color-dark-purple px-4 py-4 text-white font-medium sm:font-semibold text-xs sm:text-sm text-center"
          >
            {t('schedule_by_time', { ns: 'dashboard' })}
          </Link>
          <Link
            to="/student/mentors-list"
            className="rounded-lg bg-white px-4 py-4 text-color-dark-purple font-medium sm:font-semibold text-xs sm:text-sm text-center"
          >
            {t('schedule_by_mentor', { ns: 'dashboard' })}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScheduleBanner;
