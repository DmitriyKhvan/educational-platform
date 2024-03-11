import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../../../../modules/auth';

import {
  MUTATION_UPDATE_STUDENT,
  MUTATION_UPDATE_USER,
} from '../../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import notify from '../../../../utils/notify';

import { BsPencil } from 'react-icons/bs';

import { useTranslation } from 'react-i18next';
import {
  countries,
  genders,
  getItemToLocalStorage,
  timezoneOptions,
} from '../../../../constants/global';
import Button from '../../../../components/Form/Button/Button';
import InputField from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';
import { Avatar } from '../../../../widgets/Avatar/Avatar';
import { trimSpaces } from 'src/utils/trimSpaces';
import { Link, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { FaChevronLeft } from 'react-icons/fa6';

const EditProflileStudent = () => {
  const history = useHistory();
  const [updateStudent] = useMutation(MUTATION_UPDATE_STUDENT);
  const [updateUser] = useMutation(MUTATION_UPDATE_USER);

  const [t] = useTranslation(['profile', 'common']);
  const [file, setFile] = React.useState(null);

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

  const onSubmit = async (area) => {
    const {
      firstName,
      lastName,
      koreanEquivalent,
      gender,
      country,
      address,
      phoneNumber,
      timeZone,
    } = trimSpaces(area);

    await updateStudent({
      variables: {
        // id: parseInt(user?.student?.id),
        id: parseInt(getItemToLocalStorage('studentId')),
        data: {
          avatar: file,
          firstName: firstName,
          lastName: lastName,
          koreanEquivalent: koreanEquivalent,
          gender: gender,
        },
      },
      onError: () => {
        notify(t('error_avatar_upload', { ns: 'profile' }), 'error');
      },
    });

    await updateUser({
      variables: {
        id: parseInt(user?.id),
        data: {
          country: country,
          address: address,
          phoneNumber: phoneNumber,
          timeZone: timeZone,
        },
      },
      onCompleted: async () => {
        setTimeout(async () => {
          await refetchUser();
          notify(t('student_information_changed', { ns: 'profile' }));
          history.push('/student/profile');
        }, 400);
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
    <section className="max-w-[400px] px-5 sm:px-0 mx-auto mt-10">
      <div className="mb-5 flex items-center">
        <Link className="mr-3" to="/student/profile">
          <FaChevronLeft className="text-[16px] font-bold" />
        </Link>
        <h3 className="text-black m-0 text-[32px] font-bold">
          {t('edit_profile')}
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-center">
          <div className="relative w-[150px] h-[150px] rounded-full">
            {!file && (
              <Avatar
                className="rounded-full w-full h-full"
                avatarUrl={user?.avatar?.url}
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
                <div className="group p-[6px] rounded-full border-solid border-4 border-white absolute bottom-0 right-0 cursor-pointer bg-color-light-purple hover:bg-color-purple duration-300">
                  <BsPencil className="w-5 h-5 text-color-purple group-hover:text-white" />
                </div>
              </label>
            )}
          </div>
        </div>
        <section>
          <section className="mt-4">
            <InputField
              className="w-full"
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
              className="w-full"
              label={t('last_name', { ns: 'common' })}
              type={'text'}
              placeholder={'Addison'}
              {...register('lastName')}
            />
          </section>

          <section className="mt-4">
            <InputField
              className="w-full"
              label={t('first_name', { ns: 'common' })}
              type={'text'}
              placeholder={'Alisa'}
              {...register('firstName')}
            />
          </section>

          <section className="mt-4">
            <InputField
              className="w-full"
              label={t('phone_number', { ns: 'common' })}
              type={'text'}
              placeholder="+1(555)555-5555"
              {...register('phoneNumber')}
            />
          </section>

          <section className="mt-4">
            <InputField
              className="w-full"
              label={t('address', { ns: 'common' })}
              type={'text'}
              placeholder="123 Street, City, State"
              {...register('address')}
            />
          </section>
        </section>

        <Button className="mt-10 w-full" type="submit" theme="purple">
          {t('save', { ns: 'common' })}
        </Button>
      </form>
    </section>
  );
};

export default EditProflileStudent;
