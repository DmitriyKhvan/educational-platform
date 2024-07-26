import React, { useMemo } from 'react';
import Button from 'src/components/Form/Button';
import { FaCopy } from 'react-icons/fa';
import {
  IoTriangleSharp,
  IoSquareSharp,
  IoEllipseSharp,
} from 'react-icons/io5';
import { InfoItem } from './InfoItem';
import notify from 'src/shared/utils/notify';
import { GENERATE_REFERRAL_LINK } from 'src/shared/apollo/mutations/referralCodes';
import { useMutation, useQuery } from '@apollo/client';
import { getItemToLocalStorage } from 'src/shared/constants/global';
import { Trans, useTranslation } from 'react-i18next';
import { APP_CONFIG } from 'src/shared/apollo/queries/appConfig';
import ReactLoader from 'src/components/common/Loader';

export const Info = () => {
  const { t } = useTranslation(['refer']);
  const { loading, error, data } = useQuery(APP_CONFIG, {
    fetchPolicy: 'no-cache',
  });

  const findValue = (key) => {
    return data?.appConfigs.find((config) => config.configName === key)
      ?.configValue;
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

  const translate = (key, value) => {
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
          studentId: getItemToLocalStorage('studentId'),
        },
        fetchPolicy: 'no-cache',
      });

      await navigator.clipboard.writeText(
        referralUrl.data?.generateReferralLink?.referralUrl,
      );
      notify('Referral link copied to clipboard');
    } catch (error) {
      notify('Error in copying referral link: ', error, 'error');
    }
  };

  if (error) {
    notify(error.message, 'error');
    return <div></div>;
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
        {t('share_subtitle')}
      </h5>
      <h5 className="text-gray-400 leading-6 text-center">
        {t('share_subtitle_2')}
      </h5>

      <div className="space-y-3 mt-6">
        {info.map((item) => {
          return <InfoItem key={item.color} info={item} />;
        })}
      </div>

      <Button
        onClick={() => copyReferralLink()}
        className="w-full h-[60px] space-x-3 mt-6"
      >
        <FaCopy />
        <span className="text-[15px] font-semibold">{t('copy_link')}</span>
      </Button>
    </div>
  );
};
