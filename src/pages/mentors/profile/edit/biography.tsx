import { useMutation } from '@apollo/client';

// import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/providers/auth-provider';
import { MUTATION_UPDATE_MENTOR } from '@/shared/apollo/graphql';
import { useForm } from 'react-hook-form';

import notify from '@/shared/utils/notify';

import ReactLoader from '@/components/common/loader';
import Button from '@/components/form/button/button';
import { TextareaField } from '@/components/form/textarea-field';
import { useTranslation } from 'react-i18next';

const Biography = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);

  const { user, refetchUser } = useAuth();

  // const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      introduction: user?.mentor?.introduction,
      relevantExperience: user?.mentor?.relevantExperience,
      uniqueFacts: user?.mentor?.uniqueFacts,
    },
  });

  const handleEditBigraphy = async (area: {
    introduction?: string | null;
    relevantExperience?: string | null;
    uniqueFacts?: string | null;
  }) => {
    await updateMentor({
      variables: {
        id: Number.parseInt(user?.mentor?.id ?? ''),
        data: area,
      },
      onCompleted: () => {
        notify('Biography information is changed!', 'success');
        // navigate('/mentor/profile');
      },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });

    await refetchUser();
  };

  return (
    <>
      {loading && <ReactLoader />}
      <form onSubmit={handleSubmit(handleEditBigraphy)} id="bio">
        <h2 className="mb-5 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
          {t('biography')}
        </h2>

        <TextareaField
          className="w-full"
          placeholder={t('bio_intro')}
          label={t('summary')}
          text={t('bio_intro')}
          {...register('introduction')}
        />

        <TextareaField
          className="w-full"
          placeholder={t('bio_experience')}
          label={t('bio_experience_label')}
          text={t('bio_experience')}
          {...register('relevantExperience')}
        />

        <TextareaField
          className="w-full"
          placeholder={t('bio_facts')}
          label={t('bio_facts_label')}
          text={t('bio_facts')}
          {...register('uniqueFacts')}
        />
        <Button className="w-full" type="submit">
          {t('save', { ns: 'common' })}
        </Button>
      </form>
    </>
  );
};

export default Biography;
