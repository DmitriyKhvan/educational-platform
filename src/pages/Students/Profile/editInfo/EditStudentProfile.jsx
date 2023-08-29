import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../../../../modules/auth';
import femaleAvatar from '../../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../../assets/images/avatars/img_avatar_male.png';

import {
  MUTATION_UPDATE_STUDENT,
  MUTATION_UPDATE_USER,
} from '../../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import notify from '../../../../utils/notify';

import { AiFillEdit } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  countries,
  genders,
  timezoneOptions,
} from '../../../../constants/global';
import Button from '../../../../components/Form/Button/Button';
import ReactLoader from '../../../../components/common/Loader';
import InputField from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';

const EditProflileStudent = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);
  const [profileImage, setProfileImage] = React.useState('');
  const [file, setFile] = React.useState(null);

  const history = useHistory();
  const [, setPreview] = React.useState({});

  const [updateUser, { loading: updateUserLoading }] =
    useMutation(MUTATION_UPDATE_USER);

  const { user, refetchUser } = useAuth();

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      koreanEquivalent: user?.koreanEquivalent,
      gender: user?.gender,
      lastName: user?.lastName,
      firstName: user?.firstName,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
    },
  });

  const avatar = user?.student?.avatar?.url;

  React.useEffect(() => {
    if (avatar) {
      setProfileImage(avatar);
    } else if (user?.gender === 'female') {
      setProfileImage(femaleAvatar);
    } else if (user?.gender === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [user, avatar]);

  const onSubmit = async (area) => {
    if (file) {
      setPreview(area.avatar);

      updateStudent({
        variables: {
          id: parseInt(user?.student?.id),
          data: {
            avatar: file,
          },
        },
        onError: () => {
          notify(t('error_avatar_upload', { ns: 'profile' }), 'error');
        },
      });
    }

    updateUser({
      variables: {
        id: parseInt(user?.id),
        data: {
          koreanEquivalent: area.koreanEquivalent,
          lastName: area.lastName,
          gender: area.gender,
          timeZone: area.timeZone,
          phoneNumber: area.phoneNumber,
          firstName: area.firstName,
          country: area.country,
          address: area.address,
        },
      },
      onCompleted: () => {
        notify('Student information is changed!');
        history.push('/student/profile');
        refetchUser();
      },
      onError: () => {
        notify(
          t('error_student_information_changed', { ns: 'profile' }),
          'error',
        );
      },
    });
  };

  const removePreviewImage = () => setFile(null);

  return (
    <>
      {updateUserLoading && <ReactLoader />}
      <section className="w-[500px] p-[60px]">
        <div className="mb-5">
          <h3 className="text-black m-0 text-[20px]">{t('edit_profile')}</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative max-w-fit">
            {!file && (
              <img
                className="w-[150px] h-[150px] cursor-pointer rounded-full object-cover"
                src={profileImage}
                alt={'userInfo.tutorName'}
              />
            )}

            {file ? (
              <>
                <img
                  src={URL.createObjectURL(file)}
                  alt="Thumb"
                  className="w-[150px] h-[150px] cursor-pointer rounded-full object-cover"
                />
                <button
                  className="absolute top-0 right-0 text-2xl cursor-pointer text-red-500"
                  onClick={removePreviewImage}
                >
                  &times;
                </button>
              </>
            ) : (
              <label>
                <input
                  className="hidden"
                  multiple
                  accept="image/*"
                  type={'file'}
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <AiFillEdit className="absolute top-0 right-0 text-xl cursor-pointer" />
              </label>
            )}
          </div>
          <section>
            <section className="mt-4">
              <InputField
                label={t('korean_name', { ns: 'profile' })}
                type={'text'}
                placeholder={'알렉스'}
                {...register('koreanEquivalent')}
              />
            </section>

            <section className="mt-4">
              <label className="not-italic font-semibold text-base text-color-dark-purple">
                {t('gender')}{' '}
                <Controller
                  control={control}
                  defaultValue={user?.gender}
                  name="gender"
                  render={({ field: { value, onChange } }) => (
                    <SelectField
                      value={value}
                      options={genders}
                      onChange={onChange}
                    />
                  )}
                />
              </label>
            </section>

            <section className="mt-4">
              <label className="not-italic font-semibold text-base text-color-dark-purple">
                {t('time_zone', { ns: 'common' })}

                <Controller
                  control={control}
                  defaultValue={user?.timeZone}
                  name="timeZone"
                  render={({ field: { value, onChange } }) => (
                    <SelectField
                      value={value}
                      options={timezoneOptions}
                      onChange={onChange}
                    />
                  )}
                />
              </label>
            </section>

            <section className="mt-4">
              <label className="not-italic font-semibold text-base text-color-dark-purple">
                {t('country', { ns: 'common' })}
                <Controller
                  control={control}
                  defaultValue={user?.country}
                  name="country"
                  render={({ field: { value, onChange } }) => (
                    <SelectField
                      value={value}
                      options={countries}
                      onChange={onChange}
                    />
                  )}
                />
              </label>
            </section>

            <section className="mt-4">
              <InputField
                label={t('last_name', { ns: 'common' })}
                type={'text'}
                placeholder={'Addison'}
                {...register('lastName')}
              />
            </section>

            <section className="mt-4">
              <InputField
                label={t('first_name', { ns: 'common' })}
                type={'text'}
                placeholder={'Alisa'}
                {...register('firstName')}
              />
            </section>

            <section className="mt-4">
              <InputField
                label={t('phone_number', { ns: 'common' })}
                type={'text'}
                placeholder="+1(555)555-5555"
                {...register('phoneNumber')}
              />
            </section>

            <section className="mt-4">
              <InputField
                label={t('address', { ns: 'common' })}
                type={'text'}
                placeholder={'Bakarov 98'}
                {...register('address')}
              />
            </section>
          </section>

          <Button className="mt-10 w-full" type="submit" theme="purple">
            {t('save', { ns: 'common' })}
          </Button>
        </form>
      </section>
    </>
  );
};

export default EditProflileStudent;
