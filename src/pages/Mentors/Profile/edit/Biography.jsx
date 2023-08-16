import { useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
// import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../../modules/auth';
import { MUTATION_UPDATE_MENTOR } from '../../../../modules/auth/graphql';
import Submit from './Submit';
import { Textarea } from './Textarea';
import notify from '../../../../utils/notify';

import { useTranslation } from 'react-i18next';

const Biography = ({ cls }) => {
  const [t] = useTranslation('profile');
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);

  const { user, refetchUser } = useAuth();

  // const history = useHistory();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      introduction: user?.mentor?.introduction,
      relevantExperience: user?.mentor?.relevantExperience,
      uniqueFacts: user?.mentor?.uniqueFacts,
    },
  });

  const handleEditBigraphy = async (area) => {
    const { data } = await updateMentor({
      variables: {
        id: parseInt(user?.mentor?.id),
        data: area,
      },
    });

    if (data) {
      notify('Biography information is changed!', 'success');
      // history.push('/mentor/profile');
    }

    await refetchUser();
  };

  return (
    <form
      onSubmit={handleSubmit(handleEditBigraphy)}
      className={cls.editProfile_container_forms_biography}
      id="bio"
    >
      <div>
        <div className={cls.editProfile_container_forms_biography_title}>
          <h2>{t('biography')}</h2>
        </div>

        {/* <div className={cls.bio_guild_card}>
          <img src={Stick} alt='' />
          <h3>Guidelines on writing a biography.</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet ligula nisi.
          </p>
          <p>
            Aliquam ultrices, dui quis convallis aliquam, erat odio rhoncus
            purus, quis posuere leo tellus.
          </p>
        </div> */}

        <Textarea
          placeholder={t('bio_intro')}
          label=""
          text={t('bio_intro')}
          {...register(
            'introduction',
            // {
            //   minLength: {
            //     value: 400,
            //   },
            // },
            // ,
            // {
            //   maxLength: {
            //     value: 400,
            //     message: () =>
            //       window.alert(
            //         'The Introduction characters should be less than 400',
            //       ),
            //   },
            // }
          )}
        />
        {/* {errors?.introduction && errors?.introduction?.message()} */}

        <Textarea
          placeholder={t('bio_experience')}
          label={t('bio_experience_label')}
          text={t('bio_experience')}
          {...register(
            'relevantExperience',
            // {
            //   minLength: {
            //     value: 400,
            //   },
            // },
            // , {
            // maxLength: {
            //   value: 400,
            //   message: () =>
            //     window.alert(
            //       'The Relevant Experience characters should be less than 400',
            //     ),
            // },
            // }
          )}
        />
        {/* {errors?.relevantExperience && errors?.relevantExperience?.message()} */}

        <Textarea
          placeholder={t('bio_facts')}
          label={t('bio_facts_label')}
          text={t('bio_facts')}
          {...register(
            'uniqueFacts',
            // {
            //   minLength: {
            //     value: 400,
            //   },
            // },
            // , {
            // maxLength: {
            //   value: 400,
            //   message: () =>
            //     window.alert(
            //       'The Unique Facts characters should be less than 400',
            //     ),
            // },
            // }
          )}
        />
        {/* {errors?.uniqueFacts && errors?.uniqueFacts?.message()} */}

        <Submit />
      </div>
    </form>
  );
};

export default Biography;
