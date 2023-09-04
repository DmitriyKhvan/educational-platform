import React, { useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Layout from '../../../components/Layout';
import capitalize from 'lodash/capitalize';
import continue_arrow from '../../../assets/images/continue_arrow.svg';
import { useQuery } from '@apollo/client';
import { PACKAGE_QUERY } from '../../../modules/auth/graphql';
import { useAuth } from '../../../modules/auth';
import Loader from '../../../components/Loader/Loader';

const SelectLesson = ({
  setSelectedPlan,
  setTabIndex,
  clicked,
  setClicked,
  lesson,
}) => {
  const [t] = useTranslation(['lessons', 'common', 'modals']);
  const history = useHistory();
  const { id } = useParams();
  const { user } = useAuth();
  const {
    data: { packageSubscriptions: planStatus = [] } = {},
    loading: planStatusesLoading,
  } = useQuery(PACKAGE_QUERY, {
    variables: {
      userId: user?.id,
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

  const LessonCard = ({ title, duration, remaining, data, i }) => {
    return (
      <div className='md:max-w-xs flex-grow'>
        <div
          className={`cursor-pointer p-5 border rounded-lg ${
            i === clicked
              ? 'border-color-purple border-2 shadow-[0_0_0_4px_#F0EBF7] '
              : 'border-color-border-grey'
          }`}
          onClick={() => {
            setClicked(i);
            setSelectedPlan(data);
          }}
        >
          <div>
            <h1
              className="text-color-dark-purple text-xl tracking-tight font-semibold mb-4"
            >
              {capitalize(title)}
            </h1>

            <div className="flex gap-2 flex-row">
              <div className="text-color-dark-purple font-medium text-[17px] border border-color-border-grey rounded px-2.5 py-[5px] flex-grow text-center">
                {t('lessons_remaining', { ns: 'lessons', count: remaining })}
              </div>
              <div className="font-medium text-[17px] px-2.5 py-[5px] text-color-purple bg-color-light-purple rounded">
                {duration}{t('minutes_short', { ns: 'common' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="h-full overflow-y-auto sm:px-10 sm:py-8 lg:pt-12 lg:px-12 xl:pl-[65px] xl:pr-[90px]">
        <div className="flex flex-col gap-2.5 mb-[27px]">
          <h1 className="text-[40px] text-color-dark-purple leading-normal tracking-tight">
            {!id
              ? t('schedule_lesson')
              : t('reschedule_lesson', { ns: 'modals' })}
          </h1>
          <p className="text-xl text-color-light-grey font-medium tracking-tight">
            {!id
              ? t('schedule_lesson_subtitle')
              : t('reschedule_lesson_subtitle')}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-[29px] gap-y-6 mb-10">
          {planStatusesLoading ? (
            <Loader />
          ) : (
            planStatus.map((x, i) => (
              <LessonCard
                title={x.package?.course?.title}
                duration={x.package?.sessionTime}
                remaining={x.credits}
                data={x}
                i={i}
                key={i}
                expirationDate={x.periodEnd}
              />
            ))
          )}
        </div>
        <div className='flex gap-5'>
            <button
              className="border border-solid border-color-border-grey p-[15px] text-[15px] font-semibold rounded-[5px]"
              onClick={returnToDashboard}
            >
              {t('return_to_dash')}
            </button>
            <button
              className="bg-color-purple p-[15px] flex flex-row items-center gap-1.5 text-white font-semibold rounded-[5px]"
              disabled={disabled}
              onClick={() => setTabIndex(1)}
            >
              <span>{t('continue_custom')}</span>
              <span >
                <img src={continue_arrow} alt="arrow" />
              </span>
            </button>
        </div>
      </div>
    </Layout>
  );
};

export default SelectLesson;
