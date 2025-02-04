import { useAuth } from '@/app/providers/auth-provider';
import ReactLoader from '@/components/common/loader';
import Button from '@/components/form/button/button';
import InputField from '@/components/form/input-field';
import { MUTATION_UPDATE_MENTOR } from '@/shared/apollo/graphql';
import notify from '@/shared/utils/notify';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Education = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);

  // const [file] = React.useState({});

  // const navigate = useNavigate();

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

  const handleEditEdu = async (area: {
    university?: string | null;
    graduatingYear?: number | null;
    degree?: string | null;
    major?: string | null;
  }) => {
    // if (file) {
    //   const files = file.target?.files[0];
    //   updateMentor({
    //     variables: {
    //       id: parseInt(user?.mentor?.id),
    //       data: { diplomaVerification: { upload: files } },
    //     },
    //   });
    // }

    const newData = {
      ...area,
      graduatingYear: Number.parseInt(area.graduatingYear?.toString() ?? ''),
    };

    await updateMentor({
      variables: {
        id: user?.mentor?.id,
        data: newData,
      },
      onCompleted: () => {
        notify('Education information is changed!');
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
      <form onSubmit={handleSubmit(handleEditEdu)} id="edu">
        <h2 className="mb-5 text-[20px] font-bold text-color-dark-purple tracking-[-0.6px] leading-6">
          {t('bio_education')}
        </h2>

        <InputField
          className="w-full mb-6"
          label={t('university')}
          placeholder={t('university_placeholder')}
          {...register('university')}
        />

        <InputField
          className="w-full mb-6"
          type="number"
          label={t('grad_year')}
          placeholder="2018"
          {...register('graduatingYear')}
        />

        <InputField
          className="w-full mb-6"
          label={t('university_degree')}
          placeholder="A.B English"
          {...register('degree')}
        />

        <InputField
          className="w-full mb-6"
          label={t('university_major')}
          placeholder="Major"
          {...register('major')}
        />

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

        <Button className="w-full" type="submit">
          {t('save', { ns: 'common' })}
        </Button>
      </form>
    </>
  );
};

export default Education;
