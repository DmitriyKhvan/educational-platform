import React, { useMemo } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createMultiSelect } from './createMultiSelect';
import { useTranslation } from 'react-i18next';

export default function LoginForm({ register, errors }) {
  const [parent] = useAutoAnimate();
  const [t, i18n] = useTranslation(['onboarding', 'common', 'translations']);

  const options = useMemo(
    () => [
      t('facebook'),
      t('influencers'),
      t('search'),
      t('referrals'),
      t('other'),
    ],
    [i18n],
  );

  const components = useMemo(
    () =>
      createMultiSelect(
        options,
        'marketingChannel',
        register,
        'Please choose one of the options',
      ),
    [options],
  );

  return (
    <fieldset className="flex flex-col space-y-4 w-full" ref={parent}>
      <legend className="text-2xl font-bold">
        {t('media_channel_question')}
      </legend>

      {components}

      {errors.marketingChannel && (
        <span className="text-red-500 font-normal">
          * {errors.marketingChannel.message}
        </span>
      )}
    </fieldset>
  );
}
