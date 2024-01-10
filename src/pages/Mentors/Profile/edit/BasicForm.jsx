import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../../../modules/auth';
import { useMutation } from '@apollo/client';
import {
  MUTATION_UPDATE_MENTOR,
  MUTATION_UPDATE_USER,
} from '../../../../modules/auth/graphql';
// import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  countries,
  timezoneOptions,
  useGenderDic,
} from '../../../../constants/global';
import notify from '../../../../utils/notify';
import CheckboxField from '../../../../components/Form/CheckboxField';
import InputField from '../../../../components/Form/InputField';
import { SelectField } from '../../../../components/Form/SelectField';
import Button from '../../../../components/Form/Button/Button';
import ReactLoader from '../../../../components/common/Loader';
import { trimSpaces } from 'src/utils/trimSpaces';

const BasicForm = () => {
  const [t] = useTranslation(['common', 'profile']);
  const [updateUser] = useMutation(MUTATION_UPDATE_USER);
  const [updateMentor, { loading }] = useMutation(MUTATION_UPDATE_MENTOR);

  const genders = useGenderDic();

  // const history = useHistory();

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
        // history.push('/mentor/profile');
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

          <CheckboxField
            className="mb-6"
            label="Update mentor availability and calendar to reflect new timezone"
            {...register('convertAvailabilityTime')}
          />
          <br></br>
          <CheckboxField
            className="mb-6"
            label={t('google_calendar_sync')}
            {...register('googleCalendarSync')}
          />
          <br></br>
          { !user.googleCalendarSync ? <a className="_btn_1swtc_4 _purple_1swtc_33 w-[420px]" href={user.googleServiceSyncUrl}>Enable google calendar sync by link</a> : null}
          <br></br>
        </div>

        <Button className="w-[420px]" type="submit">
          {t('save')}
        </Button>
      </form>
    </>
  );
};

export default BasicForm;
