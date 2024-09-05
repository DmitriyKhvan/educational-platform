import Button from '@/components/form/button/button';
import Loader from '@/components/loader/loader';
import { ModalPurchase } from '@/components/modal-purchase';
import { cn } from '@/shared/utils/functions';
import { getTranslatedTitle } from '@/shared/utils/get-translated-title';
import { ucFirst } from '@/shared/utils/uc-first';
import { useActivePackages } from '@/shared/utils/use-active-packages';
import type { PackageSubscription } from '@/types/types.generated';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { LuClock4 } from 'react-icons/lu';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { IoArrowBack } from 'react-icons/io5';
import ProgressBar from '@/shared/ui/progress-bar';
import { useMemo } from 'react';

const SelectLesson = ({
  setSelectedPlan,
  setTabIndex,
}: {
  setSelectedPlan: (pkg: PackageSubscription) => void;
  setTabIndex: (index: number) => void;
}) => {
  const [t, i18n] = useTranslation(['lessons', 'common', 'modals']);
  const navigate = useNavigate();

  const { activePackages, isLoading } = useActivePackages();

  const PackageCard = ({ pkg }: { pkg: PackageSubscription }) => {
    const { credits, package: pkgSub } = pkg;

    const indicatorColor = useMemo(() => {
      if (credits && pkgSub?.totalSessions) {
        const percentage = credits / pkgSub.totalSessions;

        if (percentage <= 0.25) {
          return 'rgba(234, 33, 33, 1)';
        }

        if (percentage <= 0.5) {
          return 'rgba(255, 147, 53, 1)';
        }

        return 'rgba(0, 217, 134, 1)';
      }
    }, [credits, pkgSub?.totalSessions]);

    return (
      <div
        className={cn(
          'w-full p-4 border border-gray-100 rounded-xl shadow-[0px_4px_16px_0px_rgba(0,_0,_0,_0.08)]',
        )}
      >
        <div className="flex items-start flex-col gap-4 flex-wrap">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center gap-1 text-[13px] text-color-purple font-medium">
              <LuClock4 className="text-base" />
              <span>{pkgSub?.sessionTime} min. lessons</span>
            </div>

            <div className="flex items-center gap-1 text-[13px] text-color-purple font-medium">
              <FaRegCalendarAlt className="text-base" />
              <span>{pkgSub?.sessionsPerWeek} lesson(s) per week</span>
            </div>
          </div>

          <h1 className="font-bold text-lg text-color-dark-purple">
            {pkgSub?.isReferral && '🎁 '}
            {(pkgSub?.course && ucFirst(getTranslatedTitle(pkgSub.course, i18n.language))) || ''}
          </h1>

          {credits && pkgSub?.totalSessions && (
            <div
              style={{ color: indicatorColor }}
              className="flex flex-col gap-2 w-full text-[13px] font-medium"
            >
              <span>{credits && `${credits}/${pkgSub.totalSessions}`} lessons left</span>
              <ProgressBar
                percentage={(credits / pkgSub.totalSessions) * 100}
                bgIndicator={indicatorColor || 'rgba(0, 217, 134, 1)'}
              />
            </div>
          )}
        </div>

        <Button onClick={() => selectPlan(pkg)} className="w-full mt-6">
          Select
        </Button>
      </div>
    );
  };

  const selectPlan = (pkg: PackageSubscription) => {
    setSelectedPlan(pkg);
    setTabIndex(1);
  };

  return (
    <div className="h-full max-w-[488px] mx-auto">
      {isLoading ? (
        <Loader height="100%" />
      ) : activePackages && activePackages?.length > 0 ? (
        <>
          <div className="flex items-center gap-2.5 mb-[27px]">
            <IoArrowBack
              onClick={() => navigate('/student/manage-lessons')}
              className="text-2xl cursor-pointer"
            />
            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold leading-normal tracking-tight">
              Select package
            </h1>
          </div>

          <div className="space-y-6">
            {activePackages?.map((pkg) => pkg !== null && <PackageCard key={pkg.id} pkg={pkg} />)}
          </div>
        </>
      ) : (
        <ModalPurchase />
      )}
    </div>
  );
};

export default SelectLesson;
