/* eslint-disable import/no-unresolved */
/* eslint-disable no-undef  */

// need to replace with graphql

import { useMutation } from '@apollo/client';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useAuth } from '../../../../modules/auth';
import { MUTATION_UPDATE_USER } from '../../../../modules/auth/graphql';
import Submit from './Submit';
import { TextInput } from './TextInput';
import Select from 'react-select';
import timezones from 'timezones-list';
import find from 'lodash-es/find';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getData } from 'country-list';
import { useTranslation } from 'react-i18next';
import { getTimezoneOffset } from 'date-fns-tz';
import TutorApi from '../../../../api/TutorApi';
import { getTutorInfo } from '../../../../actions/tutor';

const timezoneOptions = timezones.map(({ label, tzCode }) => ({
  label,
  value: tzCode,
}));

function getIntHoursOffset(tzCode) {
  return getTimezoneOffset(tzCode) / 60 / 60 / 1000;
}

function getOffsetBetweenTimezones(tzCode1, tzCode2) {
  const utcTz1 = getIntHoursOffset(tzCode1);
  const utcTz2 = getIntHoursOffset(tzCode2);

  return utcTz1 - utcTz2;
}

const BasicForm = ({ cls }) => {
  const dispatch = useDispatch();
  const [t] = useTranslation(['common', 'profile']);
  const [updateMentor] = useMutation(MUTATION_UPDATE_USER);

  const notify = () => toast('Basic information is changed!');

  const history = useHistory();

  const { user, refetchUser } = useAuth();

  const { register, handleSubmit, control } = useForm({
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      address: user?.address,
      gender: user?.gender,
      convertAvailabilityTime: true,
    },
  });

  const handleEditBasicInfo = async ({ convertAvailabilityTime, ...values }) => {
    const oldTimezone = user?.timeZone;
    delete values.email;
    const { data } = await updateMentor({
      variables: {
        id: user?.id,
        data: values,
      },
    });

    if (convertAvailabilityTime && oldTimezone !== values.timeZone) {
      const offsetHours = getOffsetBetweenTimezones(oldTimezone, values.timeZone);
      await TutorApi.adjustTutorAvailability(offsetHours);
    }

    if (data) {
      dispatch(getTutorInfo(user.mentor.id));
      notify();
      history.push('/mentor/profile');
    }

    await refetchUser();
  };

  const countries = getData().map((x) => x.name);

  return (
    <form
      onSubmit={handleSubmit(handleEditBasicInfo)}
      className={cls.editProfile_container_forms_basic}
      id="basic"
    >
      <div>
        <div className={cls.editProfile_container_forms_basic_title}>
          <h2>{t('basic_info', { ns: 'profile' })}</h2>
        </div>

        <TextInput
          type="text"
          placeholder={'Alice'}
          label={t('first_name')}
          {...register('firstName')}
        />

        <TextInput
          type="text"
          placeholder={'Addison'}
          label={t('last_name')}
          {...register('lastName')}
        />

        <div className={cls.form_divider}>
          <p>{t('gender', { ns: 'profile' })}</p>

          <select {...register('gender')}>
            <option value={'male'}>{t('male', { ns: 'profile' })}</option>
            <option value={'female'}>{t('female', { ns: 'profile' })}</option>
            <option value={'non-binary'}>Non-binary</option>
          </select>
        </div>

        <TextInput
          type="email"
          placeholder={'example@gmail.com'}
          label={t('email', { ns: 'profile' })}
          disabled={true}
          {...register('email')}
        />

        <TextInput
          type="text"
          placeholder={'+11231234567'}
          label={t('phone_number')}
          {...register('phoneNumber')}
        />

        <div className="basic">
          <div className={cls.form_divider}>
            <p>{t('country')}</p>

            <div className="tutor_timeZone">
              <Controller
                control={control}
                name="country"
                defaultValue={user?.country}
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
            </div>
          </div>
        </div>

        <TextInput
          type="text"
          placeholder={'Cupertino 1337'}
          label={t('address')}
          {...register('address')}
        />

        <div className={cls.form_divider}>
          <p>{t('time_zone')}</p>

          <div className="tutor_timeZone">
            <Controller
              control={control}
              name="timeZone"
              defaultValue={user?.timeZone}
              render={({ field: { ref, value, onChange } }) => (
                <Select
                  inputRef={ref}
                  value={find(timezoneOptions, { value })}
                  options={timezoneOptions}
                  onChange={(e) => onChange(e.value)}
                />
              )}
            />
          </div>
          <div className="tutor_checkbox">
            <label>
              <input type="checkbox" {...register('convertAvailabilityTime')} />
              <span>
                Update mentor availability and calendar to reflect new timezone
              </span>
            </label>
          </div>
        </div>
      </div>

      <Submit />
    </form>
  );
};

export default BasicForm;
