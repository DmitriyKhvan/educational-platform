import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useAuth } from '../../../../modules/auth';

import {
  MUTATION_UPDATE_STUDENT,
  MUTATION_UPDATE_USER,
} from '../../../../modules/auth/graphql';
import { useMutation } from '@apollo/client';
import notify from '../../../../utils/notify';

// import { AiFillEdit } from 'react-icons/ai';

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
import { Avatar } from '../../../../widgets/Avatar/Avatar';
// import editIcon from '../../../../assets/images/EditIcon.png';

const EditProflileStudent = () => {
  const [updateStudent, { loading: updateStudentLoading }] = useMutation(
    MUTATION_UPDATE_STUDENT,
  );
  const [updateUser, { loading: updateUserLoading }] =
    useMutation(MUTATION_UPDATE_USER);

  const [t] = useTranslation(['profile', 'common']);
  const [file, setFile] = React.useState(null);

  const history = useHistory();
  const [, setPreview] = React.useState({});

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
    if (file) {
      setPreview(area.avatar);

      await updateStudent({
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

    await updateUser({
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
      onCompleted: async () => {
        notify(t('student_information_changed', { ns: 'profile' }));
        await refetchUser();
        history.push('/student/profile');
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
      {(updateUserLoading || updateStudentLoading) && <ReactLoader />}
      <section className="w-[500px] p-[60px]">
        <div className="mb-5">
          <h3 className="text-black m-0 text-[20px]">{t('edit_profile')}</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative max-w-fit">
            {!file && (
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden">
                <Avatar avatarUrl={user?.student?.avatar?.url} />
              </div>
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
                {/* <AiFillEdit className="absolute top-0 right-0 text-xl cursor-pointer" /> */}
                {/* <img
                  className="absolute bottom-0 right-0 cursor-pointer"
                  src={editIcon}
                  alt="edit"
                /> */}

                <div className="group p-[6px] rounded-full border-solid border-4 border-white absolute bottom-0 right-0 cursor-pointer bg-color-light-purple hover:bg-color-purple duration-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-color-purple group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                    />
                  </svg>
                </div>
              </label>
            )}
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
    </>
  );
};

export default EditProflileStudent;
