import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TextInput } from '../../../../components/TextInput';
import { useAuth } from '../../../../modules/auth';
import Select from 'react-select';
import femaleAvatar from '../../../../assets/images/avatars/img_avatar_female.png';
import maleAvatar from '../../../../assets/images/avatars/img_avatar_male.png';
import './index.scss';

import {
  MUTATION_UPDATE_STUDENT,
  MUTATION_UPDATE_USER,
} from '../../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import timezones from 'timezones-list';
import find from 'lodash-es/find';
import notify from '../../../../utils/notify';
import { getData } from 'country-list';

import { AiFillEdit } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const timezoneOptions = timezones.map(({ label, tzCode }) => ({
  label,
  value: tzCode,
}));

const EditProflileStudent = () => {
  const [t] = useTranslation(['profile', 'common']);
  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);
  const [profileImage, setProfileImage] = React.useState('');
  const [file, setFile] = React.useState(null);

  const history = useHistory();
  const [, setPreview] = React.useState({});

  const [updateUser] = useMutation(MUTATION_UPDATE_USER);

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
    } else if (user?.student?.gender === 'female') {
      setProfileImage(femaleAvatar);
    } else if (user?.student?.gender === 'male') {
      setProfileImage(maleAvatar);
    } else {
      setProfileImage(maleAvatar);
    }
  }, [user, avatar]);

  const onSubmit = async (area) => {
    if (file) {
      setPreview(area.avatar);

      const { error } = await updateStudent({
        variables: {
          id: parseInt(user?.student?.id),
          data: {
            avatar: file,
          },
        },
      });

      if (error) {
        notify('Avatar upload failed', 'error');
      }
    }

    const { data: userData } = await updateUser({
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
    });

    if (userData) {
      notify('Student information is changed!');
      history.push('/student/profile');
    }

    await refetchUser();
  };

  const countries = getData().map((x) => x.name);

  const removePreviewImage = () => setFile(null);

  return (
    <section className="edit-profile-modal">
      <div className="header">
        <h3>{t('edit_profile')}</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="body">
        <div className="avatar-block relative max-w-fit">
          {!file && <img src={profileImage} alt={'userInfo.tutorName'} />}

          {file ? (
            <>
              <img
                src={URL.createObjectURL(file)}
                alt="Thumb"
                className="previewImg"
              />
              <button
                className="absolute top-0 right-0 text-2xl cursor-pointer text-red-500"
                onClick={removePreviewImage}
              >
                &times;
              </button>
            </>
          ) : (
            <label htmlFor="inputTag" className="file_upload">
              <input
                id="inputTag"
                multiple
                accept="image/*"
                type={'file'}
                onChange={(e) => setFile(e.target.files[0])}
              />
              <AiFillEdit className="absolute top-0 right-0 text-xl cursor-pointer" />
            </label>
          )}
        </div>
        <section className="scroll-form">
          <section>
            <TextInput
              label={t('korean_name')}
              type={'text'}
              placeholder={'알렉스'}
              {...register('koreanEquivalent')}
            />
          </section>
          <section>
            <label>
              {t('gender')}
              <select {...register('gender')}>
                <option value={'male'}>Male</option>
                <option value={'female'}>Female</option>
                <option value={'non-binary'}>Non-binary</option>
              </select>
            </label>
          </section>

          <section className="space-y-2">
            <label>{t('time_zone', { ns: 'common' })}</label>
            <Controller
              control={control}
              defaultValue={user?.timeZone}
              name="timeZone"
              render={({ field: { ref, value, onChange } }) => (
                <Select
                  inputRef={ref}
                  value={find(timezoneOptions, { value })}
                  options={timezoneOptions}
                  onChange={(e) => onChange(e.value)}
                />
              )}
            />
          </section>
          <section className="space-y-2">
            <label htmlFor="country">{t('country', { ns: 'common' })}</label>
            <Controller
              control={control}
              defaultValue={user?.country}
              name="country"
              render={({ field: { ref, value, onChange } }) => (
                <Select
                  inputRef={ref}
                  value={{ label: value, value: value }}
                  options={countries.map((each) => {
                    return { label: each, value: each };
                  })}
                  onChange={(e) => onChange(e.value)}
                />
              )}
            />
          </section>

          <section>
            <TextInput
              label={t('last_name', { ns: 'common' })}
              type={'text'}
              placeholder={'Addison'}
              {...register('lastName')}
            />
          </section>
          <section>
            <TextInput
              label={t('first_name', { ns: 'common' })}
              type={'text'}
              placeholder={'Alisa'}
              {...register('firstName')}
            />
          </section>
          <section>
            <TextInput
              label={t('phone_number', { ns: 'common' })}
              type={'text'}
              placeholder="+1(555)555-5555"
              {...register('phoneNumber')}
            />
          </section>
          <section>
            <TextInput
              label={t('address', { ns: 'common' })}
              type={'text'}
              placeholder={'Bakarov 98'}
              {...register('address')}
            />
          </section>
        </section>
        <button style={{ cursor: 'pointer' }} type="submit">
          {t('save', { ns: 'common' })}
        </button>
      </form>
    </section>
  );
};

export default EditProflileStudent;
