import Button from '@/components/form/button/button';
import CheckboxField from '@/components/form/checkbox-field';
import Loader from '@/components/loader/loader';
import { ModalPurchase } from '@/components/modal-purchase';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/tooltip';
import { cn } from '@/shared/utils/functions';
import { getTranslatedTitle } from '@/shared/utils/get-translated-title';
import { ucFirst } from '@/shared/utils/uc-first';
import { useActivePackages } from '@/shared/utils/use-active-packages';
import { useTranslation } from 'react-i18next';
import { FaArrowRight } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

const SelectLesson = ({ setSelectedPlan, selectedPlan, setTabIndex, clicked, setClicked }) => {
  const [t, i18n] = useTranslation(['lessons', 'common', 'modals']);
  const navigate = useNavigate();
  const { id } = useParams();

  const disabled = clicked === null ? true : false;

  const { activePackages, isLoading } = useActivePackages();

  const returnToDashboard = () => {
    navigate('/student/manage-lessons');
  };

  const LessonCard = ({
    title,
    duration,
    remaining,
    data,
    i,
    active,
    total,
    isReferral = false,
  }) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger className="block w-full mb-6">
            <label
              className={cn(
                `flex justify-between cursor-pointer p-5 border rounded-lg w-full`,
                !active && 'grayscale bg-white brightness-75 opacity-80 cursor-not-allowed',
                i === clicked &&
                  active &&
                  'border-color-purple border-2 shadow-[0_0_0_4px_#F0EBF7]',
              )}
            >
              <div className="flex items-start flex-col gap-2 flex-wrap">
                <h1 className="font-bold text-base sm:text-lg leading-7 tracking-[-0.6px] text-color-dark-purple">
                  {isReferral && '🎁 '}
                  {ucFirst(title) || 'Title'}
                </h1>

                <div className="flex gap-7 items-center">
                  <div>
                    <span className="block text-xs sm:text-sm text-color-light-grey">
                      {t('lessons_remaining', { ns: 'profile' })}
                    </span>
                    <span className="block text-xs sm:text-sm text-color-dark-purple text-left">
                      {remaining && `${remaining}/${total}`}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xs sm:text-sm text-color-light-grey">
                      {t('duration', { ns: 'lessons' })}
                    </span>
                    <span className="block text-xs sm:text-sm text-color-dark-purple text-left">
                      {duration}
                    </span>
                  </div>
                </div>
              </div>

              <CheckboxField
                disabled={!active}
                type="radio"
                name="package"
                checked={i === clicked && active}
                onChange={() => selectPlan(i, data)}
              />
            </label>
          </TooltipTrigger>
          {!active && (
            <TooltipContent>
              <div className="text-center">
                <p className="text-color-dark-purple text-sm font-semibold max-w-[16rem]">
                  {t('disabled_package')}
                </p>
              </div>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  const selectPlan = (idx, plan) => {
    setClicked(idx);
    setSelectedPlan(plan);
  };

  const sheduleLesson = () => {
    if (selectedPlan?.active) {
      setTabIndex(1);
    }
  };

  return (
    <div className="h-full max-w-[488px] mx-auto">
      {isLoading ? (
        <Loader height="100%" />
      ) : (activePackages?.length ?? 0) > 0 ? (
        <>
          <div className="flex flex-col gap-2.5 mb-[27px]">
            <h1 className="text-[32px] sm:text-4xl text-color-dark-purple font-bold leading-normal tracking-tight">
              {!id ? t('schedule_lesson') : t('reschedule_lesson', { ns: 'modals' })}
            </h1>
          </div>
          <div className="mb-10">
            {activePackages?.map((x, i) => (
              <LessonCard
                title={getTranslatedTitle(x.package?.course, i18n.language)}
                duration={x.package?.sessionTime}
                remaining={x.credits}
                data={x}
                i={i}
                key={i}
                expirationDate={x.periodEnd}
                active={x.active}
                total={x.package?.totalSessions}
                isReferral={x.package?.isReferral}
              />
            ))}
          </div>
          <div className="flex gap-5 mb-4">
            <Button theme="outline" onClick={returnToDashboard}>
              {t('return_to_dash')}
            </Button>

            <Button theme="purple" disabled={disabled} onClick={sheduleLesson}>
              <span className="flex flex-row items-center justify-center gap-x-2">
                <span>{t('continue_custom')}</span>
                <FaArrowRight />
              </span>
            </Button>
          </div>
        </>
      ) : (
        <ModalPurchase />
      )}
    </div>
  );
};

export default SelectLesson;
