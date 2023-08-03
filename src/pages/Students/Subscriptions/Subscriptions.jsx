import '../../../assets/styles/subscriptions.scss';
import continue_arrow from '../../../assets/images/continue_arrow.svg';

import React from 'react';

import Layout from '../../../components/Layout';
import { useTranslation } from 'react-i18next';
import LessonCard from '../ScheduleLesson/LessonCard';
import { useAuth } from '../../../modules/auth';
import { useQuery } from '@apollo/client';
import { PACKAGE_QUERY } from '../../../modules/auth/graphql';
import Loader from '../../../components/Loader/Loader';

const Subscriptions = () => {
  const [t] = useTranslation(['common', 'sidebar']);
  const { user } = useAuth();
  const { data: { packageSubscriptions: planStatus = [] } = {}, loading } =
    useQuery(PACKAGE_QUERY, {
      variables: {
        userId: user?.id,
      },
    });

  return (
    <Layout>
      <div className="referal-wrapper">
        <h2 className="title">{t('subscriptions', { ns: 'sidebar' })}</h2>
        <div className="description">{t('manage_subscriptions', {ns: 'common'})}</div>
        <div className="main_section">
          <div className="main_section-row">
            {loading ? (
              <Loader />
            ) : planStatus.length < 0 ? (
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
            ) : (
              <div className='no-items-content'>
                <div className="no-subscriptions">
                  {t('no_active_subscriptions', {ns: 'common'})}
                </div>
                <div>
                  <button
                    className="enter-btn btn-primary button_schedule custom-btn-primary"
                    onClick={() => console.log('go to packages')}
                  >
                    <span className="me-2">
                      {t('packages', { ns: 'common' })}
                    </span>
                    <span className="continue-arrow">
                      <img src={continue_arrow} alt="" />
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscriptions;
