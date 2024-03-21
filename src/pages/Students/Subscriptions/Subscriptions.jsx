import React, { useEffect, useState } from 'react';

import { useQuery } from '@apollo/client';
import Layout from '../../../layouts/DashboardLayout';
import { useTranslation } from 'react-i18next';

import Loader from '../../../components/Loader/Loader';
import { SubscriptionCard } from './SubscriptionCard';
import { PACKAGE_QUERY } from '../../../modules/auth/graphql';
import { useHistory } from 'react-router-dom';
import { getItemToLocalStorage } from 'src/constants/global';

import '../../../assets/styles/subscriptions.scss';
import Button from 'src/components/Form/Button';
import { FaPlus } from 'react-icons/fa6';
import { COURSES } from 'src/modules/graphql/queries/courses/courses';

const Subscriptions = () => {
  const [t, i18n] = useTranslation(['common', 'sidebar']);
  const [selectedTab, setSelectedTab] = useState('current');

  const navigate = useHistory();

  const { data: coursesData } = useQuery(COURSES, {
    fetchPolicy: 'network-only',
  });

  const { data: { packageSubscriptions: planStatus = [] } = {}, loading } =
    useQuery(PACKAGE_QUERY, {
      fetchPolicy: 'no-cache',
      variables: {
        studentId: getItemToLocalStorage('studentId'),
      },
    });

  const toPurchase = () => {
    navigate.push('/purchase');
  };

  const [selectedPackages, setSelectedPackages] = useState([]);

  const currentLanguage = i18n.language;

  useEffect(() => {
    if (planStatus?.length && coursesData?.courses?.length) {
      const translatedData = planStatus.map((p) => ({
        ...p,
        title:
          currentLanguage === 'kr'
            ? coursesData.courses.find(
                (course) => course.title === p.package?.course?.title,
              ).translations[0].title
            : p.package?.course?.title,
      }));
      setSelectedPackages(
        selectedTab === 'current'
          ? translatedData.filter((x) => x.active && x.credits)
          : translatedData.filter((x) => !x.active || !x.credits),
      );
    }
  }, [selectedTab, planStatus, i18n.language]);

  return (
    <Layout>
      <div className="referal-wrapper max-w-[440px] mx-auto px-5 min-h-[calc(100vh-80px)]">
        <div className="flex w-full">
          <Button
            theme="outline"
            className={`w-[50%] ml-0 rounded-r-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
              selectedTab === 'current' && 'bg-color-dark-purple text-white'
            }`}
            onClick={() => setSelectedTab('current')}
          >
            <span>{t('current')}</span>
          </Button>
          <Button
            theme="outline"
            className={`ml-[-4px] w-[50%] rounded-l-none focus:shadow-none hover:bg-color-dark-purple hover:text-white ${
              selectedTab === 'previous' && 'bg-color-dark-purple text-white'
            }`}
            onClick={() => setSelectedTab('previous')}
          >
            <span>{t('previous')}</span>
          </Button>
        </div>
        <div className="section">
          <div className="section-row">
            {loading ? (
              <div className="mt-10">
                <Loader />
              </div>
            ) : selectedPackages.length > 0 ? (
              <div className="cards-content w-full">
                <div className="content rounded w-full">
                  {selectedPackages.map((x, i) => (
                    <SubscriptionCard
                      key={i}
                      price={
                        x.payment?.buyPrice
                          ? x.payment?.buyPrice
                          : x.package?.price
                      }
                      months={x.package?.period}
                      duration={x.package?.sessionTime}
                      title={x.title}
                      totalSessions={x.package?.totalSessions}
                      sessionsPerWeek={x.package?.sessionsPerWeek}
                      costPerClass={x.package?.price / x.package?.totalSessions}
                      credits={x.credits}
                      active={x.active}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-items-content mt-16">
                <div className="no-subscriptions">
                  {t('no_active_subscriptions', { ns: 'common' })}
                </div>
              </div>
            )}
          </div>
          <Button className="w-full mt-10 h-16" onClick={toPurchase}>
            <div className="flex items-center">
              <FaPlus className="mr-3" />
              <span className="me-2">{t('add_package', { ns: 'common' })}</span>
            </div>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Subscriptions;
