import { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { FaCopy } from 'react-icons/fa';
import { IoEllipseSharp, IoSquareSharp, IoTriangleSharp } from 'react-icons/io5';
import Button from '@/components/form/button';
import ReactLoader from '@/components/common/loader';
import { GENERATE_REFERRAL_LINK } from '@/shared/apollo/mutations/referral-codes';
import { APP_CONFIG } from '@/shared/apollo/queries/app-config';
import { getItemToLocalStorage } from '@/shared/constants/global';
import notify from '@/shared/utils/notify';
import { InfoItem } from './info-item';

export const Info = () => {
  const { t } = useTranslation(['refer']);
  const { loading, error, data } = useQuery(APP_CONFIG, {
    fetchPolicy: 'no-cache',
  });

  const findValue = (key: string) => {
    return data?.appConfigs.find((config) => config.configName === key)?.configValue;
  };

  const classesCount = useMemo(() => {
    if (data) {
      return findValue('referralLinkFreeClassesCount');
    }
  }, [data]);

  const discount = useMemo(() => {
    if (data) {
      return findValue('referralLinkDiscountPercentage');
    }
  }, [data]);

  const translate = (key: string, value: string) => {
    return (
      <Trans
        t={t}
        i18nKey={key}
        values={{
          value: value,
        }}
        // components={{
        //   strong: <span className="font-semibold" />,
        // }}
      />
    );
  };

  const info = [
    {
      title: t('share_how_1_title'),
      text: t('share_how_1_subtitle'),
      icon: <IoSquareSharp className="rotate-45 text-[rgba(255,147,53,1)]" />,
      color: '255,147,53',
    },
    {
      title: translate('share_how_2_title', classesCount),
      text: translate('share_how_2_subtitle', classesCount),
      icon: <IoEllipseSharp className="text-[rgba(0,217,134,1)]" />,
      color: '0,217,134',
    },
    {
      title: translate('share_how_3_title', discount),
      text: translate('share_how_3_subtitle', discount),
      icon: <IoTriangleSharp className="text-[rgba(25,187,254,1)]" />,
      color: '25,187,254',
    },
  ];

  const [generateReferralLink] = useMutation(GENERATE_REFERRAL_LINK);

  const copyReferralLink = async () => {
    try {
      const referralUrl = await generateReferralLink({
        variables: {
          studentId: getItemToLocalStorage('studentId', ''),
        },
        fetchPolicy: 'no-cache',
      });

      await navigator.clipboard.writeText(referralUrl.data?.generateReferralLink?.referralUrl);
      notify('Referral link copied to clipboard');
    } catch (_error) {
      notify('Error in copying referral link', 'error');
    }
  };

  if (error) {
    notify(error.message, 'error');
    return <div className="w-full min-h-[calc(100svh*0.5)] sm:w-[436px]" />;
  }

  if (loading) {
    return (
      <div className="w-full min-h-[calc(100svh*0.5)] sm:w-[436px]">
        <ReactLoader />
      </div>
    );
  }

  return (
    <div className="w-full sm:w-[436px]">
      <h2 className="text-[28px] font-bold text-color-dark-purple text-center">
        {t('share_title')}{' '}
      </h2>
      <h5 className="text-gray-400 leading-6 text-center mt-4">
        {translate('share_subtitle', classesCount)}
      </h5>
      <h5 className="text-gray-400 leading-6 text-center">
        {translate('share_subtitle_2', discount)}
      </h5>

      <div className="space-y-3 mt-6">
        {info.map((item) => {
          return <InfoItem key={item.color} info={item} />;
        })}
      </div>

      <Button onClick={() => copyReferralLink()} className="w-full h-[60px] space-x-3 mt-6">
        <FaCopy />
        <span className="text-[15px] font-semibold">{t('copy_link')}</span>
      </Button>
    </div>
  );
};
