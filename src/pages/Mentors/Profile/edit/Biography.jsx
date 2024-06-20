import { useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/app/providers/AuthProvider';
import { MUTATION_UPDATE_MENTOR } from '../../../../shared/apollo/graphql';

import notify from '../../../../shared/utils/notify';

import { useTranslation } from 'react-i18next';
import Button from '../../../../components/Form/Button/Button';
import ReactLoader from '../../../../components/common/Loader';
import { TextareaField } from '../../../../components/Form/TextareaField';

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

  const handleEditBigraphy = async (area) => {
    await updateMentor({
      variables: {
        id: parseInt(user?.mentor?.id),
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
          placeholder={t('bio_intro')}
          label={t('summary')}
          text={t('bio_intro')}
          {...register('introduction')}
        />

        <TextareaField
          placeholder={t('bio_experience')}
          label={t('bio_experience_label')}
          text={t('bio_experience')}
          {...register('relevantExperience')}
        />

        <TextareaField
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
