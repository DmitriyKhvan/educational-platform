import '../../../assets/styles/subscriptions.scss';
import continue_arrow from '../../../assets/images/continue_arrow.svg';

import React from 'react';

import { useQuery } from '@apollo/client';
import Layout from '../../../components/Layout';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../modules/auth';
import Loader from '../../../components/Loader/Loader';
import { SubscriptionCard } from './SubscriptionCard';
import { PACKAGE_QUERY } from '../../../modules/auth/graphql';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const Subscriptions = () => {
  const [t] = useTranslation(['common', 'sidebar']);
  const { user } = useAuth();
  const navigate = useHistory()

  const { data: { packageSubscriptions: planStatus = [], loading } = {} } =
    useQuery(PACKAGE_QUERY, {
      variables: {
        userId: user?.id,
      },
    });
  
  const toPurchase = () => {
    navigate.push('/purchase/1')
  }

  return (
    <Layout>
      <div className="referal-wrapper">
        <h2 className="title">{t('subscriptions', { ns: 'sidebar' })}</h2>
        <div className="description">{t('manage_subscriptions', { ns: 'common' })}</div>
        <div className="section">
          <div className="section-row">
            {loading ? (
              <Loader />
            ) : planStatus.length > 0 ? (
              <div className='cards-content'>
                <div className='content rounded'>
                  {
                    planStatus.map((x, i) => (
                      <SubscriptionCard key={i}
                        price={x.package?.price}
                        title={x.package?.course?.title}
                        totalSessions={x.package?.totalSessions}
                        sessionsPerWeek={x.package?.sessionsPerWeek}
                        costPerClass={x.package?.price / x.package?.totalSessions}
                      />
                    ))
                  }
                  {/* <div className='font-light mt-6 text-sm'>
                    <div className='font-semibold text-base mb-2'>Details</div>
                    <div>Data: 03.08.2023</div>
                    <div>Name: Test Testerov</div>
                    <div>Text: Text text text</div>
                  </div> */}
                </div>
              </div>
            ) : (
              <div className='no-items-content mt-16'>
                <div className="no-subscriptions">
                  {t('no_active_subscriptions', { ns: 'common' })}
                </div>
                <button
                  className="rounded-lg btn-primary text-center to-packages mt-4 px-4 py-2 font-semibold"
                  onClick={toPurchase}
                >
                  <div className='flex items-center'>
                    <span className="me-2">
                      {t('packages', { ns: 'common' })}
                    </span>
                    <span className="continue-arrow">
                      <img src={continue_arrow} alt="" />
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Subscriptions;
