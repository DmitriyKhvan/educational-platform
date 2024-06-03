import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from 'src/app/providers/AuthProvider';
import { useMutation } from '@apollo/client';
import { MUTATION_UPDATE_MENTOR } from '../../../../shared/apollo/graphql';
// import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  countries,
  timezoneOptions,
  useGenderDic,
} from '../../../../shared/constants/global';
import notify from '../../../../shared/utils/notify';
import CheckboxField from '../../../../components/Form/CheckboxField';
import InputField from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';
import Button from '../../../../components/Form/Button/Button';
import ReactLoader from '../../../../components/common/Loader';
import { trimSpaces } from 'src/shared/utils/trimSpaces';
import { UPDATE_USER } from 'src/shared/apollo/mutations/user/updateUser';

const BasicForm = () => {
  const [t] = useTranslation(['common', 'profile']);
  const [updateUser] = useMutation(UPDATE_USER);
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);

  const genders = useGenderDic();

  // const navigate = useNavigate();

  const { user, refetchUser } = useAuth();

  const { register, handleSubmit, control } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      gender: user?.gender,
      phoneNumber: user?.phoneNumber,
      country: user?.country,
      timeZone: user?.timeZone,
      address: user?.address,
      convertAvailabilityTime: true,
      googleCalendarSync: user.googleCalendarSync,
    },
  });

  const handleEditBasicInfo = async (values) => {
    const {
      firstName,
      lastName,
      gender,
      phoneNumber,
      country,
      timeZone,
      address,
      convertAvailabilityTime,
      googleCalendarSync,
    } = trimSpaces(values);

    await updateUser({
      variables: {
        id: user?.id,
        data: {
          phoneNumber: phoneNumber,
          country: country,
          timeZone: timeZone,
          address: address,
          convertAvailabilityTime: convertAvailabilityTime,
          googleCalendarSync: googleCalendarSync,
        },
      },
      // onCompleted: () => {
      //   notify('Basic information is changed!');
      // },
      onError: (error) => {
        notify(error.message, 'error');
      },
    });

    await updateMentor({
      variables: {
        id: user?.mentor?.id,
        data: {
          firstName: firstName,
          lastName: lastName,
          gender: gender,
        },
      },
      onCompleted: () => {
        notify('Basic information is changed!');
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
      <form
        onSubmit={handleSubmit(handleEditBasicInfo)}
        className="py-[50px] pl-[66px] border-b border-solid border-color-border-grey"
        id="basic"
      >
        <h2 className="mb-5 text-[27px] font-medium leading-[33px] tracking-[-1px] text-color-dark-purple">
          {t('basic_info', { ns: 'profile' })}
        </h2>

        <div>
          <InputField
            className="w-[420px] mb-6"
            label={t('first_name')}
            placeholder={'Alice'}
            {...register('firstName')}
          />

          <InputField
            className="w-[420px] mb-6"
            label={t('last_name')}
            placeholder={'Addison'}
            {...register('lastName')}
          />

          <label className="block w-[420px] mb-6 not-italic font-semibold text-base text-color-dark-purple">
            {t('gender', { ns: 'profile' })}{' '}
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

          <InputField
            className="w-[420px] mb-6"
            label={t('email', { ns: 'profile' })}
            type="email"
            placeholder={'example@gmail.com'}
            disabled={true}
            {...register('email')}
          />

          <InputField
            className="w-[420px] mb-6"
            label={t('phone_number')}
            placeholder={'+123456789'}
            {...register('phoneNumber')}
          />

          <label className="block w-[420px] mb-6 not-italic font-semibold text-base text-color-dark-purple">
            {t('country')}{' '}
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

          <InputField
            className="w-[420px] mb-6"
            label={t('address')}
            placeholder={'Cupertino 1337'}
            {...register('address')}
          />

          <label className="block w-[420px] mb-6 not-italic font-semibold text-base text-color-dark-purple">
            {t('time_zone')}

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

          <div>
            <CheckboxField
              className="mb-6"
              label="Update mentor availability and calendar to reflect new timezone"
              {...register('convertAvailabilityTime')}
            />
          </div>

          {user.googleCalendarSync && (
            <div>
              <CheckboxField
                className="mb-6"
                label={t('google_calendar_sync', { ns: 'profile' })}
                {...register('googleCalendarSync')}
              />
            </div>
          )}

          {!user.googleCalendarSync && (
            <a href={user.googleAuth.url}>
              <Button className="w-[420px] mb-6">
                Enable google calendar sync
              </Button>
            </a>
          )}

          {user.googleCalendarSync && user.googleAuth.url && (
            <a href={user.googleAuth.url}>
              <Button className="w-[420px] mb-6">Refresh Google token</Button>
            </a>
          )}
        </div>

        <Button className="w-[420px]" type="submit">
          {t('save')}
        </Button>
      </form>
    </>
  );
};

export default BasicForm;
