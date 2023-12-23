import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import CheckboxField from '../Form/CheckboxField';
import Button from '../Form/Button';
import { useMutation } from '@apollo/client';
import { MUTATION_UPDATE_USER } from 'src/modules/auth/graphql';
import { useAuth } from 'src/modules/auth';
import notify from 'src/utils/notify';
import { useHistory } from 'react-router-dom';
import { setItemToLocalStorage } from 'src/constants/global';
import Loader from '../Loader/Loader';

export const MarketingChannelForm = () => {
  const [t] = useTranslation('onboarding');
  const history = useHistory();

  const { user } = useAuth();

  const [updateUser, { loading }] = useMutation(MUTATION_UPDATE_USER);

  const marketingChannelList = useMemo(() => {
    return [
      {
        value: 'instagram_facebook',
        label: t('instagram_facebook'),
      },
      { value: 'influencers', label: t('influencers') },
      { value: 'search', label: t('search') },
      { value: 'referrals', label: t('referrals') },
      { value: 'other', label: t('other') },
    ];
  }, [t]);

  const {
    handleSubmit,
    register,
    watch,
    formState: { isValid },
  } = useForm();

  const submitHandler = ({ marketingChannel }) => {
    updateUser({
      variables: {
        id: user.id,
        data: {
          marketingChannel,
        },
      },
      onCompleted: () => {
        setItemToLocalStorage('studentId', user.students[0].id);
        history.push('/student/manage-lessons');
      },
      onError: (error) => {
        notify(error.message);
      },
    });
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 bottom-0 right-0 z-[10000] flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}
      <form onSubmit={handleSubmit(submitHandler)}>
        <fieldset className="flex flex-col gap-4">
          <legend className="text-[15px] text-[#464752] font-normal mb-4">
            {t('media_channel_question')}
          </legend>
          {marketingChannelList.map((marketingChannel) => {
            return (
              <label
                className={`flex items-center gap-4  px-4 py-4 sm:py-6 rounded-lg border border-color-border-grey cursor-pointer ${
                  watch('marketingChannel') === marketingChannel &&
                  'border-color-purple/50'
                }`}
                key={marketingChannel.value}
              >
                <CheckboxField
                  type="radio"
                  value={marketingChannel.value}
                  name="marketingChannel"
                  {...register('marketingChannel', {
                    required: true,
                  })}
                />
                <span className="text-[15px]">{marketingChannel.label}</span>
              </label>
            );
          })}
        </fieldset>

        <Button
          className="w-full h-auto p-5 mt-8"
          type="submit"
          disabled={!isValid}
        >
          {t('proceed_dashboard')}
        </Button>
      </form>
    </>
  );
};
