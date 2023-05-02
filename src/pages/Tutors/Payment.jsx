import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getOverallStatus, getPaymentHistory } from '../../actions/tutor';

import CustomTable from '../../components/CustomTable';

import Layout from '../../components/Layout';
import ImgApproved from '../../assets/images/approved.svg';
import ImgNotApproved from '../../assets/images/not_approved.svg';

export const PaymentPage = ({ tutor }) => {
  const [t, i18n] = useTranslation('translation');
  const columns = [
    {
      title: t('lesson_date'),
      dataKey: 'start_at',
      width: 15,
      render: (text, record) => (
        <div>
          {new Date(record.start_at).toLocaleDateString()}{' '}
          {new Date(record.start_at).toLocaleTimeString()}
        </div>
      ),
    },
    {
      title: t('student_name'),
      dataKey: 'student_full_name',
      width: 25,
    },
    {
      title: t('name'),
      dataKey: 'lesson_id',
      width: 15,
    },
    {
      title: t('lesson_topic'),
      dataKey: 'title',
      width: 15,
    },
    {
      title: t('card_number'),
      dataKey: 'card',
      width: 15,
    },
    // {
    //   title: t("paid"),
    //   dataKey: "paid",
    //   width: 15,
    //   render: (text, record) => (
    //     <div className="payment-status">
    //       {record.paid ? (
    //         <>
    //           <img src={ImgApproved} alt="paid" width={16} height={16} />{" "}
    //           <span>{t("paid")}</span>
    //         </>
    //       ) : (
    //         <>
    //           <img src={ImgNotApproved} alt="paid" width={16} height={16} />{" "}
    //           <span>{t("unpaid")}</span>
    //         </>
    //       )}
    //     </div>
    //   ),
    // },
  ];

  const dispatch = useDispatch();

  const overallStatus = useSelector(
    (state) => state.tutor.status.overallStatus,
  );
  const paymentHistory = useSelector(
    (state) => state.tutor.status.paymentHistory,
  );

  const [period, setPeriod] = useState('week');

  const tutorProfile = useSelector((state) => state.users.user.tutor_profile);

  useEffect(() => {
    let from, to;
    if (period === 'week') {
      let beforeOneWeek = new Date(
          new Date().getTime() - 60 * 60 * 24 * 7 * 1000,
        ),
        day = beforeOneWeek.getDay(),
        diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1);
      from = new Date(beforeOneWeek.setDate(diffToMonday));
      to = new Date(beforeOneWeek.setDate(diffToMonday + 6));
    } else if (period === 'month') {
      let date = new Date();
      from = new Date(date.getFullYear(), date.getMonth() - 1, 1);
      to = new Date(date.getFullYear(), date.getMonth(), 0);
    } else if (period === 'year') {
      from = new Date();
      from.setFullYear(from.getFullYear() - 1);
    }
    dispatch(getOverallStatus({ tutor_id: tutor?.id || tutorProfile?.id }));
    dispatch(getPaymentHistory({ tutor_id: tutor?.id || tutorProfile?.id }));
  }, [dispatch, period]);

  return (
    <>
      <div className="statistic">
        <div className="card">
          <p className="caption">{t('one_on_one_lessons')}</p>
          <div className="box">
            <div className="hours-taught-label">{t('classes_taught')}</div>
            <div className="hours-taught-value">
              {overallStatus?.['1-on-1']?.total_classes || 0} <span>hrs</span>
            </div>
            <div className="earnings-label">{t('earnings')}</div>
            <div className="earnings-value">
              $ {overallStatus?.['1-on-1']?.earnings || 0}
            </div>
          </div>
        </div>
        <div className="card">
          <p className="caption">{t('group_lessons')}</p>
          <div className="box">
            <div className="hours-taught-label">{t('classes_taught')}</div>
            <div className="hours-taught-value">
              {overallStatus?.group?.total_classes || 0} <span>hrs</span>
            </div>
            <div className="earnings-label">{t('earnings')}</div>
            <div className="earnings-value">
              $ {overallStatus?.group?.earnings || 0}
            </div>
          </div>
        </div>
        <div className="card">
          <p className="caption">{t('overall_summary')}</p>
          <div className="box">
            <div className="hours-taught-label">
              {t('total_classes_taught')}
            </div>
            <div className="hours-taught-value">
              {(overallStatus?.group?.total_classes || 0) * 1 +
                (overallStatus?.['1-on-1']?.total_classes || 0) * 1}{' '}
              <span>{t('hrs')}</span>
            </div>
            <div className="earnings-label">{t('total_earnings')}</div>
            <div className="earnings-value">
              ${' '}
              {(overallStatus?.['1-on-1']?.earnings || 0) * 1 +
                (overallStatus?.group?.earnings || 0) * 1}
            </div>
          </div>
        </div>
      </div>
      <p className="sub-title">{t('payment_history')}</p>
      <CustomTable data={paymentHistory} columns={columns} />
    </>
  );
};

export const PaymentLayout = () => {
  return (
    <Layout>
      <div className="payment-page-layout">
        <h4 className="main-title">Payment Page</h4>
        <div className="divider" />
        <div className="scroll-layout">
          <PaymentPage />
        </div>
      </div>
    </Layout>
  );
};
