import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import duckImage from '../../../assets/images/duck.png';
import bannerLogo from '../../../assets/images/banner-logo.png';

import Button from 'src/components/Form/Button';
import { AdaptiveDialog } from 'src/components/AdaptiveDialog';
import { ModalPurchase } from 'src/components/ModalPurchase';
import { useAuth } from 'src/app/providers/AuthProvider';

const ScheduleBanner = ({ activePackages }) => {
  const { currentStudent } = useAuth();
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
          {!activePackages?.length ? (
            <AdaptiveDialog
              button={
                <Button theme="dark_purple">
                  {t('schedule_by_time', { ns: 'dashboard' })}
                </Button>
              }
            >
              <ModalPurchase />
            </AdaptiveDialog>
          ) : (
            <Link to="/student/schedule-lesson/select">
              <Button theme="dark_purple">
                {t('schedule_by_time', { ns: 'dashboard' })}
              </Button>
            </Link>
          )}

          {currentStudent?.isTrial ? (
            <AdaptiveDialog
              button={
                <Button theme="outline">
                  {t('schedule_by_mentor', { ns: 'dashboard' })}
                </Button>
              }
            >
              <ModalPurchase />
            </AdaptiveDialog>
          ) : (
            <Link to="/student/mentors-list">
              <Button theme="outline">
                {t('schedule_by_mentor', { ns: 'dashboard' })}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleBanner;
