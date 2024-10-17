import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import bannerLogo from '@/shared/assets/images/banner-logo.png';
import duckImage from '@/shared/assets/images/duck.png';

import { useAuth } from '@/app/providers/auth-provider';
import Button from '@/components/form/button';
import { ModalPurchase } from '@/components/modal-purchase';
import { AdaptiveDialog } from '@/shared/ui/adaptive-dialog';
import type { Maybe, PackageSubscription } from '@/types/types.generated';

const ScheduleBanner = ({
  activePackages,
}: { activePackages: Maybe<PackageSubscription>[] | undefined }) => {
  const { currentStudent } = useAuth();
  const [t] = useTranslation('dashboard');

  return (
    <div className="relative rounded-[10px] bg-color-banner-green h-[200px] p-6 overflow-hidden">
      <img src={duckImage} alt="duck" className="absolute right-0 bottom-0 z-[2] h-full" />
      <img src={bannerLogo} alt="banner" className="absolute right-0 top-0 z-[1] h-full" />
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
          {activePackages?.length === 0 ? (
            <AdaptiveDialog
              button={<Button theme="dark_purple">{t('book_lesson', { ns: 'dashboard' })}</Button>}
            >
              <ModalPurchase />
            </AdaptiveDialog>
          ) : currentStudent?.isTrial ? (
            <Link to="/student/schedule-trial-lesson/select">
              <Button theme="dark_purple">{t('book_lesson', { ns: 'dashboard' })}</Button>
            </Link>
          ) : (
            <Link to="/student/mentors-list">
              <Button theme="dark_purple" className="w-[148px] h-[48px]">
                {t('book_lesson', { ns: 'dashboard' })}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleBanner;
