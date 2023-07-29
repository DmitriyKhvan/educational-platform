import React, { useMemo } from 'react';
// eslint-disable-next-line import/no-unresolved
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { createMultiSelect } from './createMultiSelect';

const options = [
  'Instagram/Facebook Ads',
  'Influencers (Youtube/Instagram)',
  'Search (Naver, Google, Daum, etc.)',
  'Referrals',
  'Other',
];

export default function LoginForm({ register, errors }) {
  const [parent] = useAutoAnimate();

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
      <legend className="text-2xl font-bold">How did you hear about us?</legend>

      {components}

      {errors.marketingChannel && (
        <span className="text-red-500 font-normal">
          * {errors.marketingChannel.message}
        </span>
      )}
    </fieldset>
  );
}
