import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../../../layouts/DashboardLayout';
import capitalize from 'lodash/capitalize';
import { useQuery } from '@apollo/client';
import { PACKAGE_QUERY } from '../../../modules/auth/graphql';
import Loader from '../../../components/Loader/Loader';
import Button from '../../../components/Form/Button/Button';
import { FaArrowRight } from 'react-icons/fa6';
import { cn } from '../../../utils/functions';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/Tooltip';
import { getItemToLocalStorage } from 'src/constants/global';
import { useCourseTranslation } from 'src/utils/useCourseTranslation';

const SelectLesson = ({
  setSelectedPlan,
  selectedPlan,
  setTabIndex,
  clicked,
  setClicked,
  lesson,
}) => {
  const { getTitleByCourseId } = useCourseTranslation();
  const [t] = useTranslation(['lessons', 'common', 'modals']);
  const history = useHistory();
  const { id } = useParams();

  const {
    data: { packageSubscriptions: planStatus = [] } = {},
    loading: planStatusesLoading,
  } = useQuery(PACKAGE_QUERY, {
    variables: {
      studentId: getItemToLocalStorage('studentId'),
    },
    fetchPolicy: 'network-only',
  });
  const disabled = clicked === null ? true : false;

  useEffect(() => {
    if (lesson) {
      setSelectedPlan(planStatus[0]);
      setTabIndex(1);
    }
  }, [lesson]);

  const returnToDashboard = () => {
    history.push('/student/manage-lessons');
  };

  const LessonCard = ({ title, duration, remaining, data, i, active }) => {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={200}>
          <TooltipTrigger>
            <div
              className={cn(
                `cursor-pointer p-5 border rounded-lg w-[315px]`,
                !active &&
                  'grayscale bg-white brightness-75 opacity-80 cursor-not-allowed',
                i === clicked &&
                  active &&
                  'border-color-purple border-2 shadow-[0_0_0_4px_#F0EBF7]',
              )}
              // onClick={() => {
              //   setClicked(i);
              //   setSelectedPlan(data);
              // }}
              onClick={active ? () => selectPlan(i, data) : undefined}
            >
              <div>
                <h1 className="text-color-dark-purple text-xl tracking-tight font-semibold mb-4 truncate">
                  {capitalize(title)}
                </h1>

                <div className="flex gap-2 flex-row">
                  <div className="text-color-dark-purple font-medium text-[17px] border border-color-border-grey rounded px-2.5 py-[5px] flex-grow text-center whitespace-nowrap">
                    {t('lessons_remaining_schedule', {
                      ns: 'lessons',
                      count: remaining,
                    })}
                  </div>
                  <div className="flex items-center justify-center font-medium text-[17px] px-2.5 py-[5px] text-color-purple bg-color-light-purple rounded">
                    {duration}
                    {t('minutes_short', { ns: 'common' })}
                  </div>
                </div>
              </div>
            </div>
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
    <Layout>
      <div className="h-full overflow-y-auto p-5 sm:px-10 sm:py-8 lg:pt-12 lg:px-12 xl:py-[65px]">
        <div className="flex flex-col gap-2.5 mb-[27px]">
          <h1 className="text-[clamp(1.5rem,_5vw,_2.5rem)] text-color-dark-purple leading-normal tracking-tight">
            {!id
              ? t('schedule_lesson')
              : t('reschedule_lesson', { ns: 'modals' })}
          </h1>
          <p className="text-[clamp(1rem,_4vw,_1.25rem)] text-color-light-grey font-medium tracking-tight">
            {!id
              ? t('schedule_lesson_subtitle')
              : t('reschedule_lesson_subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-[29px] gap-y-6 mb-10">
          {planStatusesLoading ? (
            <Loader />
          ) : (
            planStatus
              .filter((pkg) => pkg.credits > 0)
              .map((x, i) => (
                <LessonCard
                  title={getTitleByCourseId(x.package?.course?.id)}
                  duration={x.package?.sessionTime}
                  remaining={x.credits}
                  data={x}
                  i={i}
                  key={i}
                  expirationDate={x.periodEnd}
                  active={x.active}
                />
              ))
          )}
        </div>
        <div className="flex gap-5">
          <Button theme="outline" onClick={returnToDashboard}>
            {t('return_to_dash')}
          </Button>

          <Button
            theme="purple"
            disabled={disabled}
            // onClick={() => setTabIndex(1)}
            onClick={sheduleLesson}
          >
            <span className="flex flex-row items-center justify-center gap-x-2">
              <span>{t('continue_custom')}</span>
              <FaArrowRight />
            </span>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default SelectLesson;
