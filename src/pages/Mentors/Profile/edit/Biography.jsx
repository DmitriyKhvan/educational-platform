import { useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../../modules/auth';
import { MUTATION_UPDATE_MENTOR } from '../../../../modules/auth/graphql';
import Submit from './Submit';
import { Textarea } from './Textarea';

import { useTranslation } from 'react-i18next';

const Biography = ({ cls }) => {
  const [t] = useTranslation('profile');
  const [intro, setIntro] = React.useState(0);
  const [exp, setExp] = React.useState('');
  const [facts, setFacts] = React.useState('');
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);

  const notify = () => toast('Biography information is changed!');

  const { user, refetchUser } = useAuth();

  const history = useHistory();
  const {
    register,
    handleSubmit
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      introduction: user?.mentor?.introduction,
      relevantExperience: user?.mentor?.relevantExperience,
      uniqueFacts: user?.mentor?.uniqueFacts,
    },
  });

  const handleEditBigraphy = async (area) => {
    console.log(area);
    const { data } = await updateMentor({
      variables: {
        id: parseInt(user?.mentor?.id),
        data: area,
      },
    });

    if (data) {
      notify();
      history.push('/mentor/profile');
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
          setState={setIntro}
          user={user?.mentor?.introduction?.length}
          state={intro}
          {...register(
            'introduction',
            {
              minLength: {
                value: 400,
              },
            },
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
          setState={setExp}
          user={user?.mentor?.relevantExperience?.length}
          state={exp}
          {...register(
            'relevantExperience',
            {
              minLength: {
                value: 400,
              },
            },
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
          setState={setFacts}
          user={user.mentor?.uniqueFacts?.length}
          state={facts}
          {...register(
            'uniqueFacts',
            {
              minLength: {
                value: 400,
              },
            },
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
