import React from 'react';
import { useForm } from 'react-hook-form';
import { TextInput } from './TextInput';
import Submit from './Submit';
import { useMutation } from '@apollo/client';
import { MUTATION_UPDATE_MENTOR } from '../../../../modules/auth/graphql';
import { useAuth } from '../../../../modules/auth';
import notify from '../../../../utils/notify';
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Education = ({ cls }) => {
  const [t] = useTranslation(['profile', 'common']);
  const [updateMentor] = useMutation(MUTATION_UPDATE_MENTOR);

  const [file] = React.useState({});

  // const history = useHistory();

  const { user, refetchUser } = useAuth();

  const { register, handleSubmit } = useForm({
    mode: 'onBlur',
    defaultValues: {
      university: user?.mentor?.university,
      graduatingYear: user?.mentor?.graduatingYear,
      degree: user?.mentor?.degree,
      major: user?.mentor?.major,
    },
  });

  const handleEditEdu = async (area) => {
    if (file) {
      const files = file.target?.files[0];
      updateMentor({
        variables: {
          id: parseInt(user?.mentor?.id),
          data: { diplomaVerification: { upload: files } },
        },
      });
    }

    const newData = {
      ...area,
      graduatingYear: parseInt(area.graduatingYear),
    };

    const { data } = await updateMentor({
      variables: {
        id: user?.mentor?.id,
        data: newData,
      },
    });

    if (data) {
      notify('Education information is changed!');
      // history.push('/mentor/profile');
    }

    await refetchUser();
  };

  return (
    <form
      onSubmit={handleSubmit(handleEditEdu)}
      className={cls.editProfile_container_forms_edu}
      id="edu"
    >
      <div>
        <div className={cls.editProfile_container_forms_edu_title}>
          <h2>{t('bio_education')}</h2>
        </div>
        <br />

        {/* <div className={cls.edu_guild_card}>
          <img src={Stick} alt='' />
          <h3>Guidelines on being honest.</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit
            amet ligula nisi.
          </p>
        </div> */}

        <div className={cls.form_divider}>
          <p>{t('university')}</p>

          <TextInput
            type="text"
            placeholder={t('university_placeholder')}
            {...register('university')}
          />
        </div>

        <div className={cls.form_divider}>
          <p>{t('grad_year')}</p>

          <TextInput
            type="number"
            placeholder="2018"
            {...register('graduatingYear')}
          />
        </div>

        <div className={cls.form_divider}>
          <p>{t('university_degree')}</p>

          <TextInput
            type="text"
            placeholder="A.B English"
            {...register('degree')}
          />
        </div>

        <div className={cls.form_divider}>
          <p>{t('university_major')}</p>

          <TextInput type="text" placeholder="Major" {...register('major')} />
        </div>

        {/* <div className={cls.form_divider}>
          <p>Certificates (optional)</p>

          <select {...register('certificates')}>
            <option value={'usa'}>Certificate Name</option>
          </select>
        </div> */}

        {/* <TextInput 
          type="text"
          defaultValue="Training Name"
          label="Other Degrees, Certificates, Certifications, and/or Experience (optional)"
          {...register("phoneNumber")}
        /> */}

        {/* <div className={cls.form_divider_edu}>
          <select {...register("certificates")}>
            <option value={"usa"}>Add More</option>
          </select>
        </div> */}

        {/* <div className={cls.edu_verify_card}>
          <img src={Verify} alt="" />

          <h3>{t('edu_verification')}</h3>

          <p>{t('edu_verification_subtitle1')}</p>

          <p>{t('edu_verification_subtitle2')}</p>

          <div className={cls.avatar_block}>
            <label htmlFor="file">
              <input
                id="file"
                type={'file'}
                multiple
                onChange={(e) => setFile(e)}
              />
              <img src={ExportArrow} alt="" />
              {t('upload', { ns: 'common' })}
            </label>
          </div>
        </div> */}

        <Submit />
      </div>
    </form>
  );
};

export default Education;
