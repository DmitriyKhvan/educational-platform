import { useAuth } from '@/app/providers/auth-provider';
import Button from '@/components/form/button';
import CheckboxField from '@/components/form/checkbox-field';
import Loader from '@/components/loader/loader';
import { UPDATE_USER } from '@/shared/apollo/mutations/user/update-user';
import { setItemToLocalStorage } from '@/shared/constants/global';
import notify from '@/shared/utils/notify';
import { useMutation } from '@apollo/client';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const MarketingChannelForm = () => {
  const [t] = useTranslation('onboarding');
  const navigate = useNavigate();

  const { user, currentStudent } = useAuth();

  const [updateUser, { loading }] = useMutation(UPDATE_USER);

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

  const submitHandler = ({ marketingChannel }: { marketingChannel?: string }) => {
    updateUser({
      variables: {
        id: user?.id,
        data: {
          marketingChannel,
        },
      },
      onCompleted: () => {
        setItemToLocalStorage('studentId', currentStudent?.id ?? user?.students?.[0]?.id);
        navigate('/student/manage-lessons');
      },
      onError: (error) => {
        notify(error.message, 'error');
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
                  watch('marketingChannel') === marketingChannel && 'border-color-purple/50'
                }`}
                key={marketingChannel.value}
              >
                <CheckboxField
                  type="radio"
                  value={marketingChannel.value}
                  {...register('marketingChannel', {
                    required: true,
                  })}
                />
                <span className="text-[15px]">{marketingChannel.label}</span>
              </label>
            );
          })}
        </fieldset>

        <Button className="w-full h-auto p-5 mt-8" type="submit" disabled={!isValid}>
          {t('proceed_dashboard')}
        </Button>
      </form>
    </>
  );
};
